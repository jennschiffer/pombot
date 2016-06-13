/*
 * The `stop` command, which stops a Pom.
 */
import {createCommand} from 'chatter';
import lookupPom from '../lib/lookup-pom';

export default createCommand({
  name: 'stop',
  description: 'Stops the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(res => {

    // if pom exists, TODO stop it
    if (res) {
      return `pom already exists with id ${res}`;
      // return `:tomato: the pom has been stopped with *Z* remaining.`;
    }

    // there's no existing pom to stop
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
