import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { UpsertInstagramUserJsonType, UpsertInstagramUserTopic } from "../firebase/topic";

import { upsertProfile } from "./upsertProfile";

export const upsertInstagramProfilePubSub = functions
  .runWith({ timeoutSeconds: 540, memory: "2GB", maxInstances: 3 })
  .pubsub.topic(UpsertInstagramUserTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { accountId, username } = message.json as UpsertInstagramUserJsonType;
      return await upsertProfile(accountId, username);
    }),
  );

export const upsertInstagramProfileTest = functions.runWith({ timeoutSeconds: 540, memory: "2GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const username = "yukos0520";
    const imageBuffer = await upsertProfile(accountId, username);
    // res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  }),
);
