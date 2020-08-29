import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import { UpdateAccountJsonType, UpdateAccountTopic } from "../firebase/topic";

import { batchUpdateAccount } from "./batchUpdateAccount";
import { updateAccount } from "./updateAccount";

export const batchUpdateAccountScheduler = scheduleFunctions()("0 4,16 * * *").onRun(
  sentryWrapper(async (context) => {
    await batchUpdateAccount();
  }),
);

export const updateAccountPubSub = functions
  .runWith({ maxInstances: 10 })
  .pubsub.topic(UpdateAccountTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId } = message.json as UpdateAccountJsonType;
      return await updateAccount(accountId);
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
    const accountlId = "wGcUhHuMn3lOcmYrqrrF";
    await updateAccount(accountlId);
    res.send();
  }),
);
