/*
* takes a promise response, a location string, and a message string
* console.logs the information, returns the message string to the slackbot
*/
export default function errorCatch(res, loc, message) {
  console.log(`error at ${loc}`, message, res);
  return `error: ${message}`;
}
