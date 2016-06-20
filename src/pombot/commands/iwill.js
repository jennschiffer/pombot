/*
 * The `i will` command, which creates a Task for a User before a Pom.
 */
import {createCommand} from 'chatter';
import {lookupPom, getPom, isPomRunning, createPom} from '../lib/poms';
import {addTaskToPom} from '../lib/tasks';

export default createCommand({
  name: 'i will',
  description: 'Records a users task for the next pom.',
}, (message, {user, channel, token, getCommand}) => {

  // look up pom
  return lookupPom(token, channel.id).then(pomId => {

    // if pom exists check if it is already running or update with start time
    if (pomId) {
      return getPom(pomId).then(pomRes => {

        // if pom exists and it's running, let user know they can't update tasks
        if (isPomRunning(pomRes)) {
          return `it's too late to declare a task, a pom is already running with *${pomRes.timeRemaining}* left.`;
        }

        // add task to this unstarted pom ID
        return addTaskToPom(pomId, token, user.id, user.name, message, getCommand);
      });
    }

    // if pom doesn't exist, create pom and then add task
    return createPom(channel.id).then(newPom => {
      return addTaskToPom(newPom.id, token, user.id, user.name, message, getCommand);
    });
  });

});
