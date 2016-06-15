/* returns the time in "x minutes and y seconds" format */
import moment from 'moment';

const getTimeString = function(timeInSeconds) {
  const duration = moment.duration(timeInSeconds, 'seconds');
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  const time = [];

  if (minutes) {
    const minutesString = (minutes !== 1) ? ' minutes' : ' minute';
    time.push(minutes + minutesString);
  }

  if (seconds) {
    const secondsString = (seconds !== 1) ? ' seconds' : ' second';
    time.push(seconds + secondsString);
  }

  return time.join(' & ');
};

export default getTimeString;
