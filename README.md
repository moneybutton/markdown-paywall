# Money Button: Paywall Example

Example application showing how to build a paywall using [Money Button](https://moneybutton.com).

## Public Demo

You can see our public demo of this app at [markdownpaywall.com](https://markdownpaywall.com).

## Demo

To run a demo of Markdown Paywall, you will need to run an instance with a public-facing OAuth Redirect URL and a public-facing Webhoook URL.

For instance, on our public demo, we have these URLs:

| URL                                        | Description        |
|--------------------------------------------|--------------------|
| https://markdownpaywall.com/oauth-callback | OAuth Redirect URL |
| https://api.markdownpaywall.com/webhook    | Webhook URL        |

Next, create an [app for testing](https://docs.moneybutton.com/docs/api-apps.html). You will need to set the OAuth Redirect URL and the Webhook URL in your app settings.

Then you will want to create two .env files:

First, copy <code>api/.env.example</code> to <code>api/.env</code> and set the <code>WEBHOOK_SECRET</code> variable to be the same as your app.

Second, copy <code>web/.env.example</code> to <code>web/.env</code> and set <code>OAUTH_IDENTIFIER</code> to be the same as your app. Also, set <code>OAUTH_IDENTIFIER</code> to be the same as your app. Finally, set <code>OAUTH_REDIRECT_URI</code> to be the same as your app.

Now you can install Markdown Paywall and run it with these commands:

```
yarn
yarn dev
```

## Index

* `api`: [Express.js](https://expressjs.com/) app which implements the test's backend including payment webhook handling.
* `web`: [Next.js](https://nextjs.org/) app which implements the test's frontend including a paywall.
