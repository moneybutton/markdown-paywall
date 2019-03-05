# Money Button: Paywall Example Web Application

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

* WEB_PORT: The port where the app will listen to requests. For example, `WEB_PORT=9000`.
* API_URL: The URL where the API is running, including the protocol specifier. For example, `http://localhost:9001` or `https://api.example.com`.
* CLIENT_IDENTIFIER: The client identifier for your app. You can retrieve this value from your Money Button account page: https://www.moneybutton.com/settings.
* OAUTH_IDENTIFIER: The OAuth identifier for your app. You can retrieve this value from your Money Button account page: https://www.moneybutton.com/settings.

Finally, run the app in development mode:

```
yarn dev
```

or 

```
npm run dev
```
