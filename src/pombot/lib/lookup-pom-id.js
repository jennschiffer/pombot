/*
* looks up a pom for the current channel
* creates channel record if it doesn't exist
* returns pom record id if it exists, null if not
*/
import {one, query} from '../../services/db';
import errorCatch from './error-catch';

// helper to get pom id
const getPomId = function(channelId) {
  // check for pom in db, return false if it doesn't exist
  return one.getCurrentPom({slack_channel_id: channelId.slack_id}).get('id').catch(res => { return false;});
};

// takes the slack channel id and returns a pom's id
const lookupPom = function(token, channelId) {
  // check for channel in db
  return one.getChannel({slack_channel_id: channelId}).then(getPomId).catch(channelRes => {

    // need to create channel, first get team id
    return one.getTeamByToken({token}).then(team => {
      // add team's channel as it doesn't exist
      query.createChannel({
        slack_channel_id: channelId,
        slack_team_id: team.id,
        name: 'EXAMPLE CHANNEL NAME', // TODO get channel name? is this even needed?
      }).then(getPomId).catch(res => errorCatch(res, 'lib/lookupPom->createChannel', 'failed to create channel'));
    }).catch(res => errorCatch(res, 'lib/lookupPom->getTeamByToken', 'failed to get team with given token'));
  });
};

export default lookupPom;