# Money Button: Paywall Example API

Example application showing how to build a paywall using [Money Button](https://moneybutton.com).

## Development

In order to run the app, first install its dependencies:

```
yarn
```

or 

```
npm install
```

Then, copy the file `.env.example` into `.env` and replace the variables found there with their corresponding values:

* API_PORT: The port where the app will listen to requests. For example, `API_PORT=9000`.
* SESSION_KEY and SESSION_SECRET: The session key and secret that will be used for handling browser sessions by [express-session](https://www.npmjs.com/package/express-session).
* WEBHOOK_SECRET: The webhook secret used to verify that your webhook is being called by Money Button and not someone else. If you need assistance on how to obtain this value, you can reach our for help on our [Telegram channel](https://t.me/moneybuttonhelp).

Finally, run the app in development mode:

```
yarn dev
```

or 

```
npm run dev
```
