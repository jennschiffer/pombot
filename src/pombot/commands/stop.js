/*
 * The `stop` command, which stops a Pom.
 */
import {createCommand} from 'chatter';
import {query} from '../../services/db';
import lookupPom from '../lib/lookup-pom';
import getTimeString from '../lib/get-time-string';

export default createCommand({
  name: 'stop',
  description: 'Stops the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(pomId => {

    // if pom exists
    if (pomId) {
      return query.stopPom({pomId}).then(stopRes => {
        const timeLeft = getTimeString(stopRes[0].date_part); // REVIEW avoid array in this select?
        return `:tomato: the pom has been stopped with *${timeLeft}* remaining.`;
      });
    }

    // there's no existing pom to stop
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
