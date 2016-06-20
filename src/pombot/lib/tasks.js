/*
* task helper functions
*/

import {one, query} from '../../services/db';
import getErrorHandler from './get-error-handler';

// helper to get tasks
export const getTasks = function(pomId) {
  return query.getTasksByPomId({pomId})
    .map(task => `> ${task.name} will ${task.description}`)
    .catch(getErrorHandler('status->getTasksByPomId', 'failed to get tasks from pom'));
};

// helper to assign task to user
export const assignTaskToUser = function(pomId, userSlackId, userName, message, getCommand) {
  return query.assignTask({
    pomId,
    userSlackId,
    message,
  }).then(taskRes => {
    // TODO get this text into messagehandler
    return `${userName}'s task for the next pom is "${message}".` +
      ` You can start this pom with the command \`${getCommand('start')}\``;
  }).catch(getErrorHandler('iwill->assignTaskToUser', 'failed to assign task to user'));
};

// helper to create task
export const addTaskToPom = function(pomId, token, userSlackId, userName, message, getCommand) {

  // if user exists, assign this task
  return one.getUserBySlackId({userSlackId}).then(user => {

    // add or update task for this pom
    return assignTaskToUser(pomId, user.id, userName, message, getCommand);
  }).catch(res => {
    // user doesn't exist so add them, first getting team id
    return one.getTeamByToken({token}).then(team => {

      // create new user
      return one.createUser({
        userSlackId,
        teamId: team.id,
        userName,
      }).then(newUser => {

        // assign task to new user
        return assignTaskToUser(pomId, newUser.id, userName, message, getCommand);
      }).catch(getErrorHandler('iwill->createUser', 'failed to create new user'));
    }).catch(getErrorHandler('iwill->getTeamByToken', 'failed to get team with given token'));
  });
};
