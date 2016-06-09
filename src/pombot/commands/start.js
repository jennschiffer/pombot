/*
 * The `start` command, which starts a Pom.
 */
import {createCommand} from 'chatter';
import sql from '../../sql';
import db from '../../services/db';

export default createCommand({
  name: 'start',
  description: 'Starts a pom timer.',
}, (message, {channel}) => {

  // get current pom in current channel
  db.query(sql.get_current_pom, channel.id).then(result => {

    // if there is a pom that's started and is not complete, show status
    if (result && result.startedAt && !result.isComplete) {
      // TODO get the time left Z in current pom
      return `there is already a pom running with *Z* left.`;
    }

    // otherwise create new pom and start it
    db.query(sql.create_start_pom, channel.id, new Date());
    // TODO get the time left Z in new pom
    return `:tomato: pom started – you have *Z* left!`;
  });

});
