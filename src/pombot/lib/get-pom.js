/*
* gets a pom by id and returns its entire context
*/
import {one, query} from '../../services/db';
import errorCatch from './error-catch';
import getTimeString from '../lib/get-time-string';

// helper to get tasks
function getTasks(pomId) {
  return query.getTasksByPomId({pomId})
    .map(task => `> ${task.name} will ${task.description}`)
    .catch(res => errorCatch(res, 'status->getTasksByPomId', 'failed to get tasks from pom'));
}

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
