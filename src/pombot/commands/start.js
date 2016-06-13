/*
 * The `start` command, which starts a Pom.
 */

import {createCommand} from 'chatter';
import {query} from '../../services/db';
import lookupPom from '../lib/lookup-pom';

export default createCommand({
  name: 'start',
  description: 'Starts a pom timer.',
}, (message, {channel, token}) => {

  // look up pom
  return lookupPom(token, channel.id).then(res => {

    // if pom exists, TODO check if already running or update with start time
    if (res) {
      return `pom already exists with id ${res}`;
      // return `there is already a pom running with *Z* left.`;
    }

    // if pom doesn't exist, TODO create with start time
    return query.createPom({slack_channel_id: channel.id}).then(newPom => {
      return `pom just created with id ${newPom[0].id}`; // REVIEW return id [].id seems weird
      // return `:tomato: pom started – you have *Z* left!`;
    });
  });

});
