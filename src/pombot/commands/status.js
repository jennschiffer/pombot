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
        const taskHeader = (pomRes.tasks.length > 0) ? 'here is the task list:' : 'there are no tasks declared.';

        if (isPomRunning(pomRes)) {
          return [`a pom is currently running with *${pomRes.timeRemaining}* left and ${taskHeader}`, pomRes.tasks];
        }

        return [`there is no pom currently running - start one with the command ` +
          `\`${getCommand('start')}\`. as for the next pom, ${taskHeader}`, pomRes.tasks];
      });
    }

    // otherwise let user know there's no running pom
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
