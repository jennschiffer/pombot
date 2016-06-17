/* updates poms to be alerted or stopped based on a global setinterval timer */
import {query} from '../../services/db';
import errorCatch from './error-catch';
import getTimeString from './get-time-string';

const checkTimer = function(onAlertedCallback, onCompletedCallback) {
  query.updatePomsSetAlerted()
    .then(alertedRes => {
      alertedRes.map(pom => {
        // alert each pom that has just been set as is_alerted=true
        onAlertedCallback(getTimeString(pom.seconds_remaining));
      });
      return alertedRes;
    }).catch(res => errorCatch(res, 'timer->updatePomsSetAlerted', 'failed to update poms to be alerted'));

  query.updatePomsSetCompleted()
    .then(completedRes => {
      completedRes.map(pom => {
        // complete each pom that has just been set as is_completed=true
        onCompletedCallback();
      });
      return completedRes;
    }).catch(res => errorCatch(res, 'timer->updatePomsSetCompleted', 'failed to update poms to be completed'));
};

export default checkTimer;
