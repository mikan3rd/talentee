import * as Sentry from "@sentry/node";

import { SENTRY_DSN } from "./config";

export const sentryWrapper = (f) => {
  return async function () {
    try {
      // eslint-disable-next-line prefer-rest-params
      return await f.apply(this, arguments);
    } catch (e) {
      if (SENTRY_DSN) {
        Sentry.captureException(e);
        await Sentry.flush(2000);
      }
      throw new Error(e);
    }
  };
};
