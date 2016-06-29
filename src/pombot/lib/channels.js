/*
* gets a pom by id and returns its entire context
*/
import {one, oneOrNone} from '../../services/db';
import getErrorHandler from './get-error-handler';

// helper to get channel
export const getChannelBySlackId = function(slackChannelId) {
  return oneOrNone.getChannel({slack_channel_id: slackChannelId})
    .catch(getErrorHandler('lib/channels->getChannelBySlackId', 'failed to get channel'));
};

// helper to create channel and then call pom Id return
export const createNewChannel = function(slackChannelId, teamId) {
  return one.createChannel({
    slack_channel_id: slackChannelId,
    slack_team_id: teamId,
  })
  .catch(getErrorHandler('lib/channels->createChannel', 'failed to create channel'));
};
