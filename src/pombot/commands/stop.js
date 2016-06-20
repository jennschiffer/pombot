/*
 * The `stop` command, which stops a Pom.
 */
import {createCommand} from 'chatter';
import {one} from '../../services/db';
import lookupPomId from '../lib/lookup-pom-id';
import getTimeString from '../lib/get-time-string';
import getErrorHandler from '../lib/get-error-handler';

function stopPom(pomId) {
  // stops pom and returns time left in seconds
  return one.stopPomById({pomId}).get('seconds_remaining');
}

export default createCommand({
  name: 'stop',
  description: 'Stops the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom
  return lookupPomId(token, channel.id).then(pomId => {

    // if pom exists stop it and let user know how much time remained
    if (pomId) {
      return stopPom(pomId).then(timeLeft => {
        return `:tomato: the pom has been stopped with *${getTimeString(timeLeft)}* remaining.`;
      }).catch(getErrorHandler('stop->stopPom', 'failed to stop the current pom'));
    }

    // there's no existing pom to stop
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
