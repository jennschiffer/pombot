/*
* takes a location string and a message string
* console.logs the information, returns the message string to the slackbot
*/
const getErrorHandler = (loc, message) => error => {
  console.log(`error at ${loc}`, message, error);
  return `error: ${message}`;
};

export default getErrorHandler;
