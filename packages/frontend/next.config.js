/* eslint-disable @typescript-eslint/no-var-requires */
const SentryCliPlugin = require("@sentry/webpack-plugin");

module.exports = {
  target: "serverless",
  env: {
    CONFIG_ENV: process.env.CONFIG_ENV,
    SENTRY_FRONTEND_DSN: process.env.SENTRY_FRONTEND_DSN,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    APOLLO_URI: process.env.SERVER_APOLLO_URI,
  },
  publicRuntimeConfig: {
    APOLLO_URI: process.env.PUBLIC_APOLLO_URI,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (process.env.CONFIG_ENV === "prod") {
      config.plugins.push(
        new SentryCliPlugin({
          include: ".",
          ignore: ["node_modules"],
        }),
      );
    }
    return config;
  },
};
