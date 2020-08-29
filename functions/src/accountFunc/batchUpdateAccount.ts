import * as admin from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";
import * as dayjs from "dayjs";

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

  const dataArray: FirebaseFirestore.DocumentData[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    dataArray.push(data);
  });

  const pubSub = new PubSub();
  for (const accountData of dataArray) {
    const data: UpdateAccountJsonType = { accountId: accountData.id };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(UpdateAccountTopic).publish(dataBuffer);
  }
};
