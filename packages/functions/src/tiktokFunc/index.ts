import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { Topic, UpsertTiktokUserJsonType } from "../firebase/topic";

import { upsertUserData } from "./upsertUserData";

export const upsertTiktokUserDataPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 10 })
  .pubsub.topic(Topic.UpsertTiktokUser)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, uniqueId } = message.json as UpsertTiktokUserJsonType;
      return await upsertUserData(accountId, uniqueId);
    }),
  );

export const upsertTiktokUserDataTest = functions.runWith({ memory: "1GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const uniqueId = "kageihina";
    const result = await upsertUserData(accountId, uniqueId);
    res.send(result);
  }),
);
