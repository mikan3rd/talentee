import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { PopularTweetsonType, Topic, UpsertTwitterUserJsonType } from "../firebase/topic";

import { upsertUserData } from "./upsertUserData";
import { getPopularTweet } from "./getPopularTweet";

export const upsertTwitterUserDataPubSub = functions
  .runWith({ maxInstances: 10 })
  .pubsub.topic(Topic.UpsertTwitterUser)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, username } = message.json as UpsertTwitterUserJsonType;
      return await upsertUserData(accountId, username);
    }),
  );

export const upsertTwitterUserDataTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const username = "NiziU__official";
    const result = await upsertUserData(accountId, username);
    res.send(result);
  }),
);

export const getPopularTweetPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 10 })
  .pubsub.topic(Topic.PopularTweet)
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
