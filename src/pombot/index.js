import {RtmClient, WebClient, MemoryDataStore} from '@slack/client';
import {createSlackBot, createCommand, createArgsAdjuster} from 'chatter';

// define commands
import startCommand from './commands/start';
import stopCommand from './commands/stop';
import statusCommand from './commands/status';
import iwillCommand from './commands/iwill';

export default function createBot(token) {

  // create bot
  return createSlackBot({
    name: 'Pombot',
    icon: 'https://dl.dropboxusercontent.com/u/294332/Bocoup/bots/pombot_icon.png',
    verbose: true,
    getSlack() {
      return {
        rtmClient: new RtmClient(token, {
          dataStore: new MemoryDataStore(),
          autoReconnect: true,
        }),
        webClient: new WebClient(token),
      };
    },
    createMessageHandler(id, {channel}) {
      // Give command a name in public channels.
      const name = channel.is_im ? null : 'pom';
      // Helper method to format the given command name.
      const getCommand = cmd => name ? `${name} ${cmd}` : cmd;

      const messageHandler = createArgsAdjuster({
        // Inject getCommand helper into message handler 2nd
        // (meta) argument.
        adjustArgs(message, meta) {
          meta.getCommand = getCommand;
          meta.token = token;
          return [message, meta];
        },
      }, createCommand({
        isParent: true,
        name,
        description: `:tomato: Hi, I'm pombot!`,
      }, [
        startCommand,
        stopCommand,
        statusCommand,
        iwillCommand,
      ]));
      // Indicate that the message handler has state so it gets cached.
      messageHandler.hasState = true;
      return messageHandler;
    },
  });

}
