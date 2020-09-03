import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { PopularTweetTopic, PopularTweetsonType } from "../firebase/topic";

import { upsertProfile } from "./upsertProfile";

// export const getPopularTweetPubSub = functions
//   .runWith({ timeoutSeconds: 540, memory: "2GB", maxInstances: 10 })
//   .pubsub.topic(PopularTweetTopic)
//   .onPublish(
//     sentryWrapper(async (message) => {
//       const { username, userId } = message.json as PopularTweetsonType;
//       console.log(userId);
//       return await getPopularTweet(username);
//     }),
//   );

export const upsertProfileTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const username = "yukos0520";
    await upsertProfile(accountId, username);
    res.send();
  }),
);
