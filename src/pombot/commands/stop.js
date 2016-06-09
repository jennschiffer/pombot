/*
 * The `stop` command, which stops a Pom.
 */
import {createCommand} from 'chatter';
import sql from '../../sql';
import db from '../../services/db';

export default createCommand({
  name: 'stop',
  description: 'Stops the current pom.',
}, (message, {channel, getCommand}) => {

  // get current pom in current channel
  db.query(sql.get_current_pom, channel.id).then(result => {

    // if there is a pom that's started and is not complete, stop and show status
    if (result && result.startedAt && !result.isComplete) {
      // TODO get the time left Z in current pom
      db.query(sql.update_stop_pom, result.id);
      return `:tomato: the pom has been stopped with *Z* remaining.`;
    }

    // there's no pom to stop
    return `there is no pom currently running – start one with the command \`${getCommand('start')}\``;
  });

});
