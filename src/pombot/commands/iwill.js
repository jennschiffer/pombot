/*
 * A stub for the "i will" command.
 */
import {createCommand} from 'chatter';
import lookupPom from '../lib/lookup-pom';
import {one, query} from '../../services/db';
import getTimeString from '../lib/get-time-string';

// helper to create task
const addTaskToPom = function(pomId, token, userSlackId, userName, message, getCommand) {

  // if user exists, assign this task
  return one.getUserBySlackId({userSlackId}).then(user => {
    // add or update task for this pom
    return query.assignTask({
      pomId,
      userSlackId: user.id,
      message,
    }).then(taskRes => {

      // let user know task was assigned
      return `${userName}'s task for the next pom is "${message}".` +
        ` You can start this pom with the command \`${getCommand('start')}\``;
    }).catch(taskRes => {
      console.log('task assignment failed', taskRes);
      return 'task assignment failed';
    });
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
        return query.assignTask({
          pomId,
          userSlackId: newUser.id,
          message,
        }).then(taskRes => {

          // let user know task was assigned
          return `${userName}'s task for the next pom is "${message}".` +
            ` You can start this pom with the command \`${getCommand('start')}\``;
        }).catch(taskRes => {
          console.log('task assignment failed', taskRes);
          return 'task assignment failed';
        });
      }).catch(newUser => {
        console.log('new user creation failed', newUser);
        return 'new user creation failed';
      });
    }).catch(teamRes => {
      console.log('error: team does not exist', teamRes); // REVIEW how to catch better?
      return 'team failure';
    });
  });
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
        return addTaskToPom(pomId, token, user.id, user.name, message, getCommand);
      }).catch(pomRes => {
        console.log('getting pom failed', pomRes);
        return 'getting pom failed';
      });
    }

    // if pom doesn't exist, create pom (but don't start it)
    return one.createPom({slack_channel_id: channel.id}).then(newPom => {

      // add task to new pom
      return addTaskToPom(newPom.id, token, user.id, user.name, message, getCommand);
    }).catch(newPomId => {
      console.log('creating pom failed', newPomId);
      return 'creating pom failed';
    });
  });

});
