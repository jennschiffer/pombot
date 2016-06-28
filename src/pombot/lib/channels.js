/*
* gets a pom by id and returns its entire context
*/
import {one, query} from '../../services/db';
import getErrorHandler from './get-error-handler';
import {getPomId} from './poms';

// helper to get channel id
export const getChannelBySlackId = function(slackChannelId) {
  return one.getChannel({slack_channel_id: slackChannelId})
    .get('id')
    .catch(getErrorHandler('lib/getchannelbyslackid->getchannel', 'failed to get channel with given channel slack id'));
};

// helper to create channel
export const createChannel = function(slackChannelId, teamId) {
  return query.createChannel({
    slack_channel_id: slackChannelId,
    slack_team_id: teamId,
  })
    .then(getPomId)
    .catch(getErrorHandler('lib/lookupPom->createChannel', 'failed to create channel'));
};
