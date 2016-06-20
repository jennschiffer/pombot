/*
 * The `start` command, which starts a Pom.
 */

import {createCommand} from 'chatter';
import {one} from '../../services/db';
import lookupPomId from '../lib/lookup-pom-id';
import getErrorHandler from '../lib/get-error-handler';
import getPom, {isPomRunning} from '../lib/get-pom';
import getTimeString from '../lib/get-time-string';

function startPom(slackChannelId) {
  // start or create pom from slack channel id and return id and time left
  return one.startPomBySlackChannelId({slack_channel_id: slackChannelId})
    .then(startRes => {
      return Object.assign(startRes, {
        timeRemaining: getTimeString(startRes.seconds_remaining),
      });
    })
    .catch(getErrorHandler('start->startPom', 'failed to start pom'));
}

export default createCommand({
  name: 'start',
  description: 'Starts a pom timer.',
}, (message, {channel, token}) => {

  // look up pom
  return lookupPomId(token, channel.id).then(pomId => {
    if (pomId) {
      // get the info from the pom and print out
      return getPom(pomId).then(pomRes => {
        if (isPomRunning(pomRes)) {
          // just let user know pom is already running
          return `there is already a pom running with *${pomRes.timeRemaining}* left.`;
        }

        // otherwise start the pom
        return startPom(channel.id).then(startRes => {
          return `:tomato: pom started – you have *${startRes.timeRemaining}* left!`;
        });
      });
    }

    // if pom doesn't exist, create with start time
    return startPom(channel.id).then(newPomRes => {
      return `:tomato: pom started – you have *${newPomRes.timeRemaining}* left!`;
    });
  });

});
