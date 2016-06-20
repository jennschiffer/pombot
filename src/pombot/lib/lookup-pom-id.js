/*
* looks up a pom for the current channel
* creates channel record if it doesn't exist
* returns pom record id if it exists, null if not
*/
import {one, query} from '../../services/db';
import getErrorHandler from './get-error-handler';

// helper to get pom id
const getPomId = function({id}) {
  // check for pom in db, return false if it doesn't exist
  return one.getCurrentPom({slack_channel_id: id}).get('id').catch(res => { return false;});
};

// takes the slack channel id and returns a pom's id
export default function lookupPom(token, slackChannelId) {
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
}
