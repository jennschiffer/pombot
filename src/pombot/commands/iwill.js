/*
 * A stub for the "i will" command.
 */
import {createCommand} from 'chatter';
import lookupPomId from '../lib/lookup-pom-id';
import {one, query} from '../../services/db';
import errorCatch from '../lib/error-catch';
import getPom from '../lib/get-pom';

// helper to assign task to user
function assignTaskToUser(pomId, userSlackId, message) {
  return query.assignTask({
    pomId,
    userSlackId,
    message,
  });
}

// helper to create pom
function createPom(slackChannelId) {
  return one.createPomBySlackChannelId({slack_channel_id: slackChannelId})
    .then(newPomRes => newPomRes)
    .catch(pomRes => errorCatch(pomRes, 'iwill->createPom', 'failed to create pom'));
}

// helper to create task
function addTaskToPom(pomId, token, userSlackId, userName, message, getCommand) {

  // if user exists, assign this task
  return one.getUserBySlackId({userSlackId}).then(user => {
    // add or update task for this pom
    return assignTaskToUser(pomId, user.id, message).then(taskRes => {
      // let user know task was assigned
      return `${userName}'s task for the next pom is "${message}".` +
        ` You can start this pom with the command \`${getCommand('start')}\``;
    }).catch(res => errorCatch(res, 'iwill->assignTask', 'failed to assign task to user'));

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
        return assignTaskToUser(pomId, newUser.id, message).then(taskRes => {
          // let user know task was assigned
          return `${userName}'s task for the next pom is "${message}".` +
            ` You can start this pom with the command \`${getCommand('start')}\``;

        }).catch(taskRes => errorCatch(taskRes, 'iwill->assignTask', 'failed to assign task to new user'));
      }).catch(userRes => errorCatch(userRes, 'iwill->createUser', 'failed to create new user'));
    }).catch(teamRes => errorCatch(teamRes, 'iwill->getTeamByToken', 'failed to get team with given token'));
  });
}

export default createCommand({
  name: 'i will',
  description: 'Records a users task for the next pom.',
}, (message, {user, channel, token, getCommand}) => {

  // look up pom
  return lookupPomId(token, channel.id).then(pomId => {

    // if pom exists check if it is already running or update with start time
    if (pomId) {
      return getPom(pomId).then(pomRes => {

        // if pom exists and it's running, let user know they can't update tasks
        if (pomRes.timeRemaining && !pomRes.is_completed) {
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
