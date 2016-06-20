/* updates poms to be alerted or stopped based on a global setinterval timer */
import {query} from '../../services/db';
import getErrorHandler from './get-error-handler';
import getTimeString from './get-time-string';

export default function checkTimer(onAlertedCallback, onCompletedCallback) {
  query.updatePomsSetAlerted({})
    .then(alertedRes => {
      alertedRes.map(pom => {
        // alert each pom that has just been set as is_alerted=true
        onAlertedCallback(getTimeString(pom.seconds_remaining), pom.slack_id);
      });
      return alertedRes;
    }).catch(getErrorHandler('timer->updatePomsSetAlerted', 'failed to update poms to be alerted'));

  query.updatePomsSetCompleted()
    .then(completedRes => {
      completedRes.map(pom => {
        // complete each pom that has just been set as is_completed=true
        onCompletedCallback(pom.slack_id);
      });
      return completedRes;
    }).catch(getErrorHandler('timer->updatePomsSetCompleted', 'failed to update poms to be completed'));
}
