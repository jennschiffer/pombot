/*
 * A stub for the "i will" command.
 */
import heredoc from 'heredoc-tag';
import {createCommand} from 'chatter';
import db from '../../services/db';

export default createCommand({
  name: 'i will',
  description: 'Records a users task for the next pom.',
}, (message, {user, channel, pomId, getCommand}) => {

  db.query('SELECT * FROM pom WHERE id=$1', pomId, 1).then(result => {

    if (result.startedAt && !result.isComplete) {
      // TODO get the time left Z in current pom
      return `it's too late to declare a task, a pom is running with *Z* left.`;
    }

    // if pom is not running or is on break, let user record task

    /*
      4. user.name enters a pom_task with the description message

      check if record for user's slack_user id exists
        if so, get slack_user_id

        if not, enter it
        INSERT INTO slack_user (slack_user_id, slack_team_id) VALUES ([slack_user_id], [slack_team_id]);

      check if pom_task with this slack_user_id and pom_id exist
        if so, update with new description value

        if not, enter it
        INSERT INTO pom_task (pom_id, slack_user_id, description) VALUES ([pom_id], [slack_user_id], message);

    */

    return heredoc.oneline.trim`
      ${user.name}'s task for the next pom is "${message}".
      You can start this pom with the command \`${getCommand('start')}\`
    `;
  });

});
