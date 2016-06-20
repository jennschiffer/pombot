/*
* gets a pom by id and returns its entire context
*/
import {one, query} from '../../services/db';
import getErrorHandler from './get-error-handler';
import getTimeString from '../lib/get-time-string';

// helper to get tasks
function getTasks(pomId) {
  return query.getTasksByPomId({pomId})
    .map(task => `> ${task.name} will ${task.description}`)
    .catch(getErrorHandler('status->getTasksByPomId', 'failed to get tasks from pom'));
}

// helper to check if pom is currently running
export const isPomRunning = function(pom) {
  return pom.timeRemaining && !pom.is_completed;
};

// returns a pom object with its tasks and time remaining
export default function getPom(pomId, opts) {
  // get pom from given id and any options
  return one.getPomById({pomId}).then(pomRes => {

    // get the tasks for this pom
    return getTasks(pomId).then(res => {
      return Object.assign(pomRes, {
        tasks: res,
        timeRemaining: getTimeString(pomRes.seconds_remaining),
      });
    });

  }).catch(pomRes => {
    // pom doesn't exist
    return false;
  });
}
