/*
 * The `status` command, which describes the status of a current Pom.
 */
import heredoc from 'heredoc-tag';
import {createCommand} from 'chatter';
import lookupPom from '../lib/lookup-pom';

export default createCommand({
  name: 'status',
  description: 'Displays the status of the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(res => {

    // if pom exists, TODO get status
    if (res) {
      return `status of pom: id is ${res}`;
      /*
        // retrieve any tasks in this pom.
        const taskList = [];
        // for (const user in pom.taskCollection) {
        //  taskList.push(`> ${user} will ${pom.taskCollection[user]}`);
        // }
        const taskHeader = (taskList.length > 0) ? 'here is the task list:' : 'there are no tasks declared.';

        if (result.startedAt && !result.isComplete) {
          // get the time left Z in current pom
          // get the list of tasks in the current pom
          return `a pom is currently running with *Z* left and ${taskHeader}`;
        }
      */
    }

    // there's no existing pom to check the status of
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
