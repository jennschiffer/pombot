require('dotenv').config();

const slack = require('slack');

const sqlite3 = require('sqlite3').verbose();

const chatter = require('chatter');
const createSlackBot = chatter.createSlackBot;

const slackOfficial = require('@slack/client');
const RtmClient = slackOfficial.RtmClient;
const WebClient = slackOfficial.WebClient;
const MemoryDataStore = slackOfficial.MemoryDataStore;

const express = require('express');

function redirectSuccess(res, message) {
  res.redirect(`/?message=${encodeURIComponent(message)}`);
}

function redirectError(res, message) {
  res.redirect(`/?error=${encodeURIComponent(message)}`);
}

function createServer(addBotIntegration) {
  const app = express();
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || '8000'
  app.listen(port, host);
  console.log(`Server running on ${host}:${port}`);

  app.get('/', (req, res) => {
    var message = req.query.message;
    if (req.query.error) {
      res.status(400);
      message = `Error: ${req.query.error}`;
    }
    const header = message ? `<p>${message}</p>` : '';
    res.send(`
      ${header}
      <p>
        <a href="https://slack.com/oauth/authorize?scope=bot&client_id=${process.env.SLACK_CLIENT_ID}"><img
          alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        /></a>
      </p>
    `);
  });

  app.get('/authorize', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    if (error) {
      return redirectError(res, error);
    }
    else if (!code) {
      return redirectError(res, 'Invalid code');
    }
    // slack api request opts
    const args = {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
    };
    // get and send the api token
    slack.oauth.access(args, (err, data) => {
      addBotIntegration(data.bot.bot_access_token, err => {
        if (err) {
          return redirectError(res, err.message);
        }
        redirectSuccess(res, 'Integration successful');
      });
    });
  });

  return app;
}

// SAMPLE BOT

function createBot(token, deactivateFn) {
  console.log('CREATE', token);
  const bot = createSlackBot({
    name: 'Pom Test Bot',
    getSlack() {
      return {
        rtmClient: new RtmClient(token, {
          dataStore: new MemoryDataStore(),
          autoReconnect: true,
          logLevel: 'error',
        }),
        webClient: new WebClient(token),
      };
    },
    createMessageHandler() {
      return message => `You said "${message}".`;
    },
    eventNames: ['open', 'message', 'disconnect'],
  });
  bot.onDisconnect = (error, code) => {
    if (code === 'account_inactive') {
      deactivateFn();
    }
  };
  bot.login();
  return bot;
}

const db = new sqlite3.Database('bots.db');

db.run(`
  CREATE TABLE IF NOT EXISTS bots (
    id SERIAL PRIMARY KEY,
    token TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false
  )
`);

function addBotIntegration(token, cb) {
  db.get("SELECT id FROM bots where token = ?", token, (err, id) => {
    if (err) {
      return cb(err);
    }
    if (id) {
      console.log('addBotIntegration UPDATE', token);
      db.run("UPDATE bots SET is_active = ? WHERE id = ?", true, id, cb);
    }
    else {
      console.log('addBotIntegration INSERT', token);
      db.run("INSERT INTO bots (token, is_active) VALUES (?, ?)", token, true, cb);
    }
  });
}

function removeBotIntegration(token) {
  console.log('removeBotIntegration', token);
  db.run("UPDATE bots SET is_active = ? WHERE token = ?", false, token);
}

// Bot cache.
const runningBots = {}

// Start a bot if it's not already running.
function startBot(token) {
  if (!runningBots[token]) {
    console.log('START', token);
    runningBots[token] = createBot(token, () => removeBotIntegration(token));
  }
}

// Stop a bot if it's running.
function stopBot(token) {
  if (runningBots[token]) {
    console.log('STOP', token);
    // TODO: figure out how to actually free up the SlackBot instance memory
    runningBots[token].slack = null;
    delete runningBots[token];
  }
}

// Query the DB and start or stop bots as needed.
function startOrStopBots() {
  db.all("SELECT token, is_active FROM bots", (err, rows) => {
    if (err) {
      return console.error(err);
    }
    const active = rows.filter(r => r.is_active).map(r => r.token);
    const inactive = rows.filter(r => !r.is_active).map(r => r.token);
    active.forEach(token => startBot(token));
    inactive.forEach(token => stopBot(token));
  });
}

createServer(addBotIntegration);

setInterval(startOrStopBots, 1000);
