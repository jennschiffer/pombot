import express from 'express';
import slack from 'slack';
import config from '../config';
import {query} from './services/db';
import createBot from './bot';

// =================================
// Get and set team integration data
// =================================

function activateTeamIntegration({payload, token, teamId}) {
  return query.teamActivateInsertUpdate({payload, token, teamId});
}

function deactivateTeamIntegration({token}) {
  return query.teamDeactivate({token});
}

function getTeamIntegrations() {
  return query.teams();
}

// ==========
// Web server
// ==========

const app = express();

function redirectSuccess(res, message) {
  res.redirect(`/?message=${encodeURIComponent(message)}`);
}

function redirectError(res, message) {
  console.error('Error', message);
  res.redirect(`/?error=${encodeURIComponent(message)}`);
}

// Show the slack button for this app and an optional message.
app.get('/', (req, res) => {
  let {message} = req.query;
  const {error} = req.query;
  if (error) {
    res.status(400);
    message = `Error: ${error}`;
  }
  const header = message ? `<p>${message}</p>` : '';
  res.send(`
    ${header}
    <p>
      <a href="https://slack.com/oauth/authorize?scope=bot&client_id=${config.tokens.client_id}">
        <img
        alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcset="
          https://platform.slack-edge.com/img/add_to_slack.png 1x,
          https://platform.slack-edge.com/img/add_to_slack@2x.png 2x
        "/>
      </a>
    </p>
  `);
});

// Add a team integration.
app.get('/authorize', (req, res) => {
  const {error, code} = req.query;
  if (error) {
    return redirectError(res, error);
  }
  else if (!code) {
    return redirectError(res, 'Invalid or missing code');
  }
  // slack api request opts
  const options = Object.assign({code}, config.tokens);
  // get and send the api token
  slack.oauth.access(options, (err, payload) => {
    if (err) {
      return redirectError(res, err.message);
    }
    const token = payload.bot.bot_access_token;
    const teamId = payload.team_id;
    activateTeamIntegration({payload, token, teamId})
    .then(() => {
      redirectSuccess(res, 'Integration successful');
    })
    .catch(er => {
      redirectError(res, er.message);
    });
  });
});

// Start the web server.
app.listen(config.app.port, config.app.host);
console.log(`Server running on ${config.app.host}:${config.app.port}.`);

// =============================
// Start and stop bots as needed
// =============================

const bots = {};

// Start a bot if it's not already running.
function startBot(token) {
  if (!bots[token]) {
    console.log('START', token);
    const bot = createBot(token);
    // Logging in ensures the rtm client has been created.
    bot.login();
    // If the rtm client disconnects because of account_inactive, the team
    // integration has been terminated.
    bot.slack.rtmClient.on('disconnect', (_, code) => {
      if (code === 'account_inactive') {
        deactivateTeamIntegration({token});
      }
    });
    bots[token] = bot;
  }
}

// Stop a bot if it's running.
function stopBot(token) {
  if (bots[token]) {
    console.log('STOP', token);
    // TODO: figure out how to actually free up the SlackBot instance memory
    delete bots[token];
  }
}

function startOrStopBots() {
  getTeamIntegrations().then(teams => {
    const active = teams.filter(t => t.is_active).map(t => t.token);
    const inactive = teams.filter(t => !t.is_active).map(t => t.token);
    active.forEach(token => startBot(token));
    inactive.forEach(token => stopBot(token));
  });
}

setInterval(startOrStopBots, 1000);
