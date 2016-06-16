/*
 * The `start` command, which starts a Pom.
 */

import {createCommand} from 'chatter';
import {one} from '../../services/db';
import lookupPom from '../lib/lookup-pom';
import getTimeString from '../lib/get-time-string';

export default createCommand({
  name: 'start',
  description: 'Starts a pom timer.',
}, (message, {channel, token}) => {

  // look up pom
  return lookupPom(token, channel.id).then(pomId => {
    // if pom exists check if it is already running or update with start time
    if (pomId) {
      return one.getPomById({pomId}).then(pomRes => {
        if (pomRes.started_at && !pomRes.is_completed) {
          const timeLeft = getTimeString(pomRes.date_part);
          return `there is already a pom running with *${timeLeft}* left.`;
        }

        return one.startPom({slack_channel_id: channel.id}).then(startRes => {
          const timeLeft = getTimeString(startRes.date_part);
          return `:tomato: pom started – you have *${timeLeft}* left!`;
        });
      });
    }

    // if pom doesn't exist, create with start time
    return one.startPom({slack_channel_id: channel.id}).then(newPom => {
      const timeLeft = getTimeString(newPom.date_part);
      return `:tomato: pom started – you have *${timeLeft}* left!`;
    });
  });

});
