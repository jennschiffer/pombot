/*
 * The `status` command, which describes the status of a current Pom.
 */
import {createCommand} from 'chatter';
import {lookupPom, getPom, isPomRunning} from '../lib/poms';

export default createCommand({
  name: 'status',
  description: 'Displays the status of the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom with token and channel id
  return lookupPom(token, channel.id).then(pomId => {
    if (pomId) {

      // get the info from the pom and print out
      return getPom(pomId).then(pomRes => {

        if (isPomRunning(pomRes)) {
          const taskHeader = (pomRes.tasks.length > 0) ? 'Task list:' : 'There are no tasks declared.';
          return [`*${pomRes.timeRemaining}* remaining. ${taskHeader}`, pomRes.tasks];
        }

        const taskHeader = (pomRes.tasks.length > 0) ? 'Task list for next pom:' : 'There are no tasks declared for the next pom.';
        return [`No pom running - start a new one with ` +
          `\`${getCommand('start')}\`. ${taskHeader}`, pomRes.tasks];
      });
    }

    // otherwise let user know there's no running pom
    return `No pom running – start a new one with \`${getCommand('start')}\``;
  });
});
