/* updates poms to be alerted or stopped based on a global setinterval timer */
import {query} from '../../services/db';
import getErrorHandler from './get-error-handler';
import getTimeString from './get-time-string';

export default function checkTimer(token, onAlertedCallback, onCompletedCallback) {

  query.updateTeamPomsSetCompleted({token})
      .then(completedRes => {
        completedRes.map(pom => {
          // complete each pom that has just been set as is_completed=true
          onCompletedCallback(pom.slack_id);
        });
        return completedRes;
      })
      .catch(getErrorHandler('lib/check-timer->updatePomsSetCompleted', 'failed to update poms to be completed'));

  query.updateTeamPomsSetAlerted({token})
    .then(alertedRes => {
      alertedRes.map(pom => {
        // alert each pom that has just been set as is_alerted=true
        onAlertedCallback(getTimeString(pom.seconds_remaining), pom.slack_id);
      });
      return alertedRes;
    })
    .catch(getErrorHandler('lib/check-timer->updatePomsSetAlerted', 'failed to update poms to be alerted'));
}
