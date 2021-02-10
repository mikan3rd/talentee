import axios from "axios";
import admin from "firebase-admin";

import { BACKEND_ENDPOINT } from "./common/config";
import { AccountCollectionPath } from "./firebase/collectionPath";
import { logger, scheduleFunctions } from "./firebase/functions";

export const migrateAccountScheduler = scheduleFunctions({ timeoutSeconds: 540 })("15,45 * * * *").onRun(
  async (context) => {
    const db = admin.firestore();
    const accountCollection = db.collection(AccountCollectionPath);

    const docs = await accountCollection.limit(30).get();

    const accountIds: string[] = [];
    const accoutDataList: IAccountData[] = [];
    docs.forEach((doc) => {
      accountIds.push(doc.id);
      accoutDataList.push(doc.data() as IAccountData);
    });

    if (!accountIds.length) {
      logger.log("Migrated!!");
      return;
    }

    const data: BodyType[] = [];

    for (const account of accoutDataList) {
      const d: BodyType = {};
      const { youtubeMainRef, twitterMainRef, instagramMainRef, tiktokMainRef } = account;

      if (youtubeMainRef?.id) {
        d.youtubeChannelId = youtubeMainRef.id;
      }

      if (twitterMainRef) {
        const { username } = (await twitterMainRef.get()).data() as TwitterUserDataType;
        d.twitterUsername = username;
      }

      if (instagramMainRef) {
        const { username } = (await instagramMainRef.get()).data() as InstagramUserType;
        d.instagramUsername = username;
      }

      if (tiktokMainRef) {
        const {
          user: { uniqueId },
        } = (await tiktokMainRef.get()).data() as TiktokUserType;
        d.tiktokUniqueId = uniqueId;
      }

      logger.log(d);
      data.push(d);
    }

    logger.debug("START: addByFirestore");
    await axios.post(`${BACKEND_ENDPOINT}/account/addByFirestore`, { data });
    logger.debug("END: addByFirestore");

    for (const account of accoutDataList) {
      const { youtubeMainRef, twitterMainRef, instagramMainRef, tiktokMainRef } = account;
      if (youtubeMainRef) {
        await youtubeMainRef.delete();
      }
      if (twitterMainRef) {
        await twitterMainRef.delete();
      }
      if (instagramMainRef) {
        await instagramMainRef.delete();
      }
      if (tiktokMainRef) {
        await tiktokMainRef.delete();
      }
    }

    for (const accountId of accountIds) {
      await accountCollection.doc(accountId).delete();
    }
  },
);

type BodyType = {
  youtubeChannelId?: string;
  twitterUsername?: string;
  instagramUsername?: string;
  tiktokUniqueId?: string;
};
