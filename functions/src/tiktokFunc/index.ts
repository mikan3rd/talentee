import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { UpsertTiktokUserJsonType, UpsertTiktokUserTopic } from "../firebase/topic";

import { upsertUserData } from "./upsertUserData";

export const upsertInstagramUserDataPubSub = functions
  .runWith({ maxInstances: 10 })
  .pubsub.topic(UpsertTiktokUserTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, username } = message.json as UpsertTiktokUserJsonType;
      return await upsertUserData(accountId, username);
    }),
  );

export const upsertInstagramUserDataTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const username = "kageihina";
    await upsertUserData(accountId, username);
    res.send();
  }),
);
