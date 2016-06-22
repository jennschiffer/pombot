import {RtmClient, WebClient, MemoryDataStore} from '@slack/client';
import {createSlackBot, createCommand, createArgsAdjuster} from 'chatter';

// define commands
import startCommand from './commands/start';
import stopCommand from './commands/stop';
import statusCommand from './commands/status';
import iwillCommand from './commands/iwill';

// timer
import checkTimer from './lib/check-timer';

export default function createBot(token) {
  // create bot
  const bot = createSlackBot({
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
      return messageHandler;
    },
  });

  // Start the timer for this bot
  setInterval(() => {
    checkTimer(
      (timeString, slackChannelId) => {
        // on alerted callback, tell user time left
        bot.postMessage(slackChannelId, `:tomato: *${timeString}* remaining in this pom!`);
      },
      slackChannelId => {
        // on completed callback, tell user pom's completed
        bot.postMessage(slackChannelId, ':tomato: Pom completed!');
      }
    );
  }, 3000);

  return bot;
}
