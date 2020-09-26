import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import {
  ServiceAccountJsonType,
  ServiceAccountTopic,
  UpdateAccountJsonType,
  UpdateAccountTopic,
} from "../firebase/topic";

import { getServiceAccount } from "./getServiceAccount";
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

export const getServiceAccountPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 3 })
  .pubsub.topic(ServiceAccountTopic)
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
