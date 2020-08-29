import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";
import * as dayjs from "dayjs";

import { toBufferJson } from "../common/utils";
import { UpdateAccountJsonType, UpdateAccountTopic } from "../firebase/topic";
import { AccountCollectionPath } from "../firebase/collectionPath";

export const batchUpdateAccount = async () => {
  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);

  const now = dayjs().add(9, "hour");
  const updatedAt = now.subtract(1, "day");
  const docs = await accountCollection
    .where("updatedAt", "<=", updatedAt.toDate())
    .orderBy("updatedAt", "asc")
    .limit(300)
    .get();

  const accountIds: string[] = [];
  docs.forEach((doc) => {
    accountIds.push(doc.id);
  });

  const pubSub = new PubSub();
  for (const accountId of accountIds) {
    const data: UpdateAccountJsonType = { accountId };
    await pubSub.topic(UpdateAccountTopic).publish(toBufferJson(data));
  }
};
