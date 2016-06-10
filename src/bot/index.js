import {createSlackBot} from 'chatter';
import {RtmClient, WebClient, MemoryDataStore} from '@slack/client';

export default function createBot(token) {

  return createSlackBot({
    name: 'Pom Test Bot',
    getSlack() {
      return {
        rtmClient: new RtmClient(token, {
          dataStore: new MemoryDataStore(),
          autoReconnect: true,
          logLevel: 'error',
        }),
        webClient: new WebClient(token),
      };
    },
    createMessageHandler() {
      return message => `You said "${message}".`;
    },
  });

}
