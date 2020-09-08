import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { UpsertTiktokUserJsonType, UpsertTiktokUserTopic } from "../firebase/topic";

import { upsertUserData } from "./upsertUserData";

export const upsertTiktokUserDataPubSub = functions
  .runWith({ maxInstances: 10 })
  .pubsub.topic(UpsertTiktokUserTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, uniqueId } = message.json as UpsertTiktokUserJsonType;
      return await upsertUserData(accountId, uniqueId);
    }),
  );

export const upsertTiktokUserDataTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const uniqueId = "kageihina";
    await upsertUserData(accountId, uniqueId);
    res.send();
  }),
);
