/*
 * The `start` command, which starts a Pom.
 */

import {createCommand} from 'chatter';
import {lookupPom, getPom, isPomRunning, startPom} from '../lib/poms';

export default createCommand({
  name: 'start',
  description: 'Starts a pom timer.',
}, (message, {channel, token}) => {

  // look up pom
  return lookupPom(token, channel.id).then(pomId => {
    if (pomId) {
      // get the info from the pom and print out
      return getPom(pomId).then(pomRes => {
        if (isPomRunning(pomRes)) {
          // just let user know pom is already running
          return `There is already a pom running with *${pomRes.timeRemaining}* remaining.`;
        }

        // otherwise start the pom
        return startPom(channel.id).then(startRes => {
          return `:tomato: Pom started – you have *${startRes.timeRemaining}* remaining!`;
        });
      });
    }

    // if pom doesn't exist, create with start time
    return startPom(channel.id).then(newPomRes => {
      return `:tomato: Pom started – you have *${newPomRes.timeRemaining}* remaining!`;
    });
  });

});
