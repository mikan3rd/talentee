import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import { ServiceAccountJsonType, Topic, UpdateAccountJsonType } from "../firebase/topic";

import { batchUpdateAccount } from "./batchUpdateAccount";
import { getServiceAccount } from "./getServiceAccount";
import { tweetAccountByYoutube } from "./tweetAccount";
import { updateAccount } from "./updateAccount";

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
  .pubsub.topic(Topic.UpdateAccount)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, videoCategories } = message.json as UpdateAccountJsonType;
      return await updateAccount(accountId, videoCategories);
    }),
  );

export const getServiceAccountPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 3 })
  .pubsub.topic(Topic.ServiceAccount)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId } = message.json as ServiceAccountJsonType;
      return await getServiceAccount(accountId);
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

export const getServiceAccountTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountlId = "UCHp2q2i85qt_9nn2H7AvGOw";
    const result = await getServiceAccount(accountlId);
    res.send(result);
  }),
);
