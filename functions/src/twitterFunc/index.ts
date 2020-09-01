import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";

import { getPopularTweet } from "./getPopularTweet";

// export const batchUpdateAccountScheduler = scheduleFunctions()("0 9,21 * * *").onRun(
//   sentryWrapper(async (context) => {
//     await batchUpdateAccount();
//   }),
// );

// export const updateAccountPubSub = functions
//   .runWith({ maxInstances: 10 })
//   .pubsub.topic(UpdateAccountTopic)
//   .onPublish(
//     sentryWrapper(async (message) => {
//       const { accountId, videoCategories } = message.json as UpdateAccountJsonType;
//       return await updateAccount(accountId, videoCategories);
//     }),
//   );

export const getPopularTweetTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountlId = "4t2P26lmXTzAaEfSy3ha";
    await getPopularTweet();
    res.send();
  }),
);
