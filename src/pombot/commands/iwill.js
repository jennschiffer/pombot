/*
 * A stub for the "i will" command.
 */
import {createCommand} from 'chatter';
import lookupPom from '../lib/lookup-pom';
import {one} from '../../services/db';

export default createCommand({
  name: 'i will',
  description: 'Records a users task for the next pom.',
}, (message, {user, channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(res => {

    // if pom exists, TODO check if running and if not add the task
    if (res) {
      return `pom already exists with id ${res}`;
      // return `:tomato: the pom has been stopped with *Z* remaining.`;
    }

    // if pom doesn't exist, TODO create and then add task
    return one.createPom({slack_channel_id: channel.id}).then(newPom => {
      return `pom just created with id ${newPom.id}`;
      // return `:tomato: pom started – you have *Z* left!`;
    });
  });

/*  db.query('SELECT * FROM pom WHERE id=$1', pomId, 1).then(result => {

    if (result.startedAt && !result.isComplete) {
      // TODO get the time left Z in current pom
      return `it's too late to declare a task, a pom is running with *Z* left.`;
    }

    // if pom is not running or is on break, let user record task


      4. user.name enters a pom_task with the description message

      check if record for user's slack_user id exists
        if so, get slack_user_id

        if not, enter it
        INSERT INTO slack_user (slack_user_id, slack_team_id) VALUES ([slack_user_id], [slack_team_id]);

      check if pom_task with this slack_user_id and pom_id exist
        if so, update with new description value

        if not, enter it
        INSERT INTO pom_task (pom_id, slack_user_id, description) VALUES ([pom_id], [slack_user_id], message);

    return heredoc.oneline.trim`
      ${user.name}'s task for the next pom is "${message}".
      You can start this pom with the command \`${getCommand('start')}\`
    `;
  });
  */

});
