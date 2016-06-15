/*
 * The `status` command, which describes the status of a current Pom.
 */
import {createCommand} from 'chatter';
import {one, query} from '../../services/db';
import lookupPom from '../lib/lookup-pom';
import getTimeString from '../lib/get-time-string';

export default createCommand({
  name: 'status',
  description: 'Displays the status of the current pom.',
}, (message, {channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(pomId => {

    // if pom exists, show time left and any tasks for it
    if (pomId) {

      // TODO retrieve any tasks that exist for this pomId
      const taskList = [];
      // for (const user in pom.taskCollection) {
      //  taskList.push(`> ${user} will ${pom.taskCollection[user]}`);
      // }
      const taskHeader = (taskList.length > 0) ? 'here is the task list:' : 'there are no tasks declared.';


      return one.getPomById({pomId}).then(pomRes => {

        if (pomRes.started_at && !pomRes.is_completed) {
          const timeLeft = getTimeString(pomRes.date_part);
          return `a pom is currently running with *${timeLeft}* left and ${taskHeader}`;
        }

        return query.startPom({slack_channel_id: channel.id}).then(startRes => {
          const timeLeft = getTimeString(startRes.date_part);
          return `:tomato: pom started – you have *${timeLeft}* left!`;
        });
      });
    }

    // there's no existing pom to check the status of
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });
});
