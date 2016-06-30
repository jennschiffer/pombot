# 🍅 Pombot
## A Slack bot for time management using the Pomodoro technique.

This bot gives intuitive commands which are designed to match Pomodoro Technique interactions.  You can use the "start," "stop," "status," and "i will" commands in a private message with Pombot, or you can invite Pombot into your channel and prefix those commands with "pom."

*Define, pom and deliver - by yourself or with friends.*

### Testing
We're using [ngrok](https://ngrok.com/) to test this and a [postgres](https://www.postgresql.org/) database to save teams, users, channels, poms and pom tasks. Here's how you can test it:

1. Install ngrok.
1. Run `ngrok http 8000` in a separate window. This process will need to stay running for a while.
1. Note the HTTPS url, it will look something like <https://e2d1dd50.ngrok.io>.
1. Create a new Slack app at <https://api.slack.com/apps/new>
  1. Enter an app name like "Pombot Cowboy Test" (but using your name)
  1. Enter placeholder short and long descriptions like "lorem ipsum"
  1. Enter the HTTPS url from step 3 in "Link to clear instructions"
  1. Click "Create app."
1. Click on "App Credentials" in the left nav.
  1. Create a `.env` file in the project root that looks like the example below, using the Client ID and Client Secret from this page.
  1. Enter the HTTPS url with `/authorize` at the end into Redirect URI(s). It'll look something like <https://e2d1dd50.ngrok.io/authorize>
  1. Click "Save Changes."
1. Click on "Bot Users" in the left nav.
  1. Click the "Add a bot to this app" button.
1. Run the app server with `node app.js`
1. Visit the HTTPS url in your browser.
1. Click the "Add to Slack" button.
1. Select Bocoup.
1. Note the bot name and click the "Authorize" button.
  * You should see the node process create the bot (the name shown will be the one hard-coded into app.js)
  * You should be able to interact with the bot in DM, like `/dm @your_bot_name hello world`

Sample .env file:

```bash
DB_HOST=your-db-host
DB_PORT=5432
SLACK_CLIENT_ID=21234567890
SLACK_CLIENT_SECRET=0a1b2c3d4e5f6g7h8i9j0k
DB_USER=your-db-user
DB_NAME=your-db-name
DB_PASSWORD=your-db-password

```

### Notes

* You should be able to kill the node app process and restart it, and the bot should restart automatically with the process.
* You should be able to find the bot in the list at <https://[your team name].slack.com/apps/manage> and click the "Remove App" button and see an eventual "account_inactive" error and the bot being deleted.
* You should be able to kill the node app process and restart it, and only non-deleted bots should restart automatically with the process.
* Multiple users should be able to authorize the same app (via the same HTTPS url) simultaneously, and only 1 bot instance should be running at a time.
