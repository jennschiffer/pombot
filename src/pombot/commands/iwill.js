/*
 * A stub for the "i will" command.
 */
import {createCommand} from 'chatter';
import lookupPom from '../lib/lookup-pom';
import {one} from '../../services/db';
import getTimeString from '../lib/get-time-string';

// helper to create task
const addTaskToPom = function(pomId, userId) {

  return userId;
  // if user exists, see if they have a task
    // if they have a task, update with message
    // else add task

  // else add user
    // add task

  /* return query.createTask({
      pom_id: pomId,
      slack_user_id: userId,
      description: message
    }).then(newTaskRes => {
      return `${user.name}'s task for the next pom is "${message}". You can start this pom with the command \`${getCommand('start')}\``;
    });*/
};

export default createCommand({
  name: 'i will',
  description: 'Records a users task for the next pom.',
}, (message, {user, channel, token, getCommand}) => {

// look up pom
  return lookupPom(token, channel.id).then(pomId => {

    // if pom exists check if it is already running or update with start time
    if (pomId) {
      return one.getPomById({pomId}).then(pomRes => {

        // if pom exists and it's running, let user know they can't update tasks
        if (pomRes.started_at && !pomRes.is_completed) {
          const timeLeft = getTimeString(pomRes.date_part);
          return `it's too late to declare a task, a pom is already running with *${timeLeft}* left.`;
        }

        // add task to this unstarted pom ID
        return addTaskToPom(pomId, user.id);
      });
    }

    // if pom doesn't exist, create pom (but don't start it) and then add task to it
    return one.createPom({slack_channel_id: channel.id}).then(newPomId => {
      return addTaskToPom(newPomId, user.id);
    });
  });

});
