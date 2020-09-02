import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { PopularTweetTopic, PopularTweetsonType } from "../firebase/topic";

import { getPopularTweet } from "./getPopularTweet";

export const getPopularTweetPubSub = functions
  .runWith({ timeoutSeconds: 540, memory: "2GB", maxInstances: 10 })
  .pubsub.topic(PopularTweetTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { username, userId } = message.json as PopularTweetsonType;
      console.log(userId);
      return await getPopularTweet(username);
    }),
  );

export const getPopularTweetTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const username = "monst_mixi";
    await getPopularTweet(username);
    res.send();
  }),
);
