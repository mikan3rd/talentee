import { sentryWrapper } from "../common/sentry";
import { functions } from "../firebase/functions";
import { UpsertInstagramUserJsonType, UpsertInstagramUserTopic } from "../firebase/topic";

import { upsertUserData } from "./upsertUserData";

// export const upsertProfilePubSub = functions
//   .runWith({ timeoutSeconds: 540, memory: "2GB", maxInstances: 10 })
//   .pubsub.topic(UpsertInstagramUserTopic)
//   .onPublish(
//     sentryWrapper(async (message) => {
//       const { accountId, username } = message.json as UpsertInstagramUserJsonType;
//       return await upsertProfile(accountId, username);
//     }),
//   );

export const upsertInstagramUserDataTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const accountId = "";
    const username = "fuygshisn";
    await upsertUserData(accountId, username);
    res.send();
  }),
);
