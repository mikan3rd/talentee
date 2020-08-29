import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";

import { updateAccount } from "./updateAccount";

// export const batchUpdateAccountScheduler = scheduleFunctions({ memory: "512MB" })("0 4 * * *").onRun(
//   sentryWrapper(async (context) => {
//     await batchUpdateServiceAccount();
//   }),
// );

// export const updateAccountPubSub = functions
//   .runWith({ timeoutSeconds: 540, memory: "2GB", maxInstances: 10 })
//   .pubsub.topic(PopularVideoTopic)
//   .onPublish(
//     sentryWrapper(async (message) => {
//       return await updateAccount(message.json as PopularVideoJsonType);
//     }),
//   );

export const updateAccountTest = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountlId = "BWa2totHra5mPTaxZ528";
    await updateAccount(accountlId);
    res.send();
  }),
);
