import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import { UpdateAccountJsonType, UpdateAccountTopic } from "../firebase/topic";

import { batchUpdateAccount } from "./batchUpdateAccount";
import { updateAccount } from "./updateAccount";
import { tweetAccountByYoutube } from "./tweetAccount";

export const batchUpdateAccountScheduler = scheduleFunctions()("0 9,21 * * *").onRun(
  sentryWrapper(async (context) => {
    await batchUpdateAccount();
  }),
);

export const tweetAccountByYoutubeScheduler = scheduleFunctions()("1 * * * *").onRun(
  sentryWrapper(async (context) => {
    await tweetAccountByYoutube();
  }),
);

export const updateAccountPubSub = functions
  .runWith({ maxInstances: 10 })
  .pubsub.topic(UpdateAccountTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, videoCategories } = message.json as UpdateAccountJsonType;
      return await updateAccount(accountId, videoCategories);
    }),
  );

export const batchUpdateAccountTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    await batchUpdateAccount();
    res.send();
  }),
);

export const updateAccountTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountlId = "4t2P26lmXTzAaEfSy3ha";
    await updateAccount(accountlId, []);
    res.send();
  }),
);

export const tweetAccountByYoutubeTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    await tweetAccountByYoutube();
    res.send();
  }),
);
