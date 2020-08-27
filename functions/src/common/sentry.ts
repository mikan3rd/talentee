import * as Sentry from "@sentry/node";

export const sentryWrapper = (f) => {
  return async function () {
    try {
      // eslint-disable-next-line prefer-rest-params
      return await f.apply(this, arguments);
    } catch (e) {
      Sentry.captureException(e);
      await Sentry.flush(2000);
      throw new Error(e);
    }
  };
};
