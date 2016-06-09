/*
 * The `status` command, which describes the status of a current Pom.
 */
import heredoc from 'heredoc-tag';
import {createCommand} from 'chatter';
import db from '../../services/db';

export default createCommand({
  name: 'status',
  description: 'Displays the status of the current pom.',
}, (message, {channel, pomId, getCommand}) => {

  db.query('SELECT * FROM pom WHERE id=$1', pomId, 1).then(result => {
    // TODO retrieve any tasks in this pom.
    const taskList = [];
    // for (const user in pom.taskCollection) {
    //  taskList.push(`> ${user} will ${pom.taskCollection[user]}`);
    // }
    const taskHeader = (taskList.length > 0) ? 'here is the task list:' : 'there are no tasks declared.';

    if (result.startedAt && !result.isComplete) {
      // TODO get the time left Z in current pom
      // TODO get the list of tasks in the current pom
      return `a pom is currently running with *Z* left and ${taskHeader}`;
    }

    return [
      heredoc.oneline.trim`
        there is no pom currently running – start one with the command \`${getCommand('start')}\`.
        ${taskHeader}
      `,
      taskList,
    ];
  });

});
