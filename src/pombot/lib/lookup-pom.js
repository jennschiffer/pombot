/*
* looks up a pom for the current channel
* creates channel record if it doesn't exist
* returns pom record id if it exists, null if not
*/
import {one, query} from '../../services/db';

// helper to get pom id
const getPomId = function(channelId) {
  // check for pom in db
  return one.getCurrentPom({slack_channel_id: channelId}).then(pomRes => {
    // return existing pom id
    return pomRes.id;
  }).catch(pomRes => {
    // pom doesn't exist
    return false;
  });
};

// takes the slack channel id and returns a pom's id
const lookupPom = function(token, channelId) {
  // check for channel in db
  return one.getChannel({slack_channel_id: channelId}).then(channelRes => {
    // get pom
    return getPomId(channelId);
  }).catch(channelRes => {

    // need to create channel, first get team id
    return one.getTeamByToken({token}).then(teamRes => {
      const teamId = teamRes.id;
      // add team's channel as it doesn't exist
      query.createChannel({
        slack_channel_id: channelId,
        slack_team_id: teamId,
        name: 'EXAMPLE CHANNEL NAME', // TODO get channel name
      }).then(res => {
        // then get pom
        return getPomId(res);
      });
    }).catch(res => {
      console.log('error: team does not exist'); // REVIEW how to catch better?
    });
  });
};

export default lookupPom;
