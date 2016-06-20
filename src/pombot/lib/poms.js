/*
* gets a pom by id and returns its entire context
*/
import {one, query} from '../../services/db';
import getErrorHandler from './get-error-handler';
import getTimeString from '../lib/get-time-string';
import {getTasks} from '../lib/tasks';

// helper to create pom
export const createPom = function(slackChannelId) {
  return one.createPomBySlackChannelId({slack_channel_id: slackChannelId})
    .catch(getErrorHandler('iwill->createPom', 'failed to create pom'));
};

// helper to start pom
export const startPom = function(slackChannelId) {
  // start or create pom from slack channel id and return id and time left
  return one.startPomBySlackChannelId({slack_channel_id: slackChannelId})
    .then(startRes => {
      return Object.assign(startRes, {
        timeRemaining: getTimeString(startRes.seconds_remaining),
      });
    })
    .catch(getErrorHandler('start->startPom', 'failed to start pom'));
};

// helper to check if pom is currently running
export const isPomRunning = function(pom) {
  return pom.timeRemaining && !pom.is_completed;
};

// helper to stop pom
export const stopPom = function(pomId) {
  return one.stopPomById({pomId}).get('seconds_remaining');
};

// returns a pom object with its tasks and time remaining
export const getPom = function(pomId, opts) {
  // get pom from given id and any options
  return one.getPomById({pomId}).then(pomRes => {

    // get the tasks for this pom
    return getTasks(pomId).then(res => {
      return Object.assign(pomRes, {
        tasks: res,
        timeRemaining: getTimeString(pomRes.seconds_remaining),
      });
    });

  }).catch(pomRes => {
    // pom doesn't exist
    return false;
  });
};

// helper to get pom id
export const getPomId = function({id}) {
  // check for pom in db, return false if it doesn't exist
  return one.getCurrentPom({slack_channel_id: id}).get('id').catch(res => { return false;});
};

// takes the slack channel id and returns a pom's id
export const lookupPom = function(token, slackChannelId) {
  // check for channel in db
  return one.getChannel({slack_channel_id: slackChannelId}).then(getPomId).catch(channelRes => {

    // need to create channel, first get team id
    return one.getTeamByToken({token}).then(team => {
      // add team's channel as it doesn't exist
      query.createChannel({
        slack_channel_id: slackChannelId,
        slack_team_id: team.id,
        name: 'EXAMPLE CHANNEL NAME', // TODO get channel name? is this even needed?
      }).then(getPomId).catch(getErrorHandler('lib/lookupPom->createChannel', 'failed to create channel'));
    }).catch(getErrorHandler('lib/lookupPom->getTeamByToken', 'failed to get team with given token'));
  });
};
