import * as admin from "firebase-admin";
import { youtube_v3 } from "googleapis";

import { AccountCollectionPath, YoutubeChannelCollectionPath } from "../../firebase/collectionPath";
import { chunk } from "../../common/utils";
import { youtubeService } from "../../common/config";

import { formatChannelData } from "./formatYoutubeData";
import { updateChannel } from "./updateChannel";

const { FieldValue } = admin.firestore;

export const saveChannel = async (channelIds: string[], check = true) => {
  const uniqueChannelIds = Array.from(new Set(channelIds));

  let channelItems: youtube_v3.Schema$Channel[] = [];
  for (const chunkChannelIds of chunk(uniqueChannelIds, 50)) {
    const channelResponse = await youtubeService.channels.list({
      part: ["id", "snippet", "contentDetails", "statistics", "topicDetails", "brandingSettings"],
      id: chunkChannelIds,
    });
    channelItems = channelItems.concat(channelResponse.data.items);
  }

  const db = admin.firestore();
  const accountCollection = db.collection(AccountCollectionPath);
  const youtubeChannelCollection = db.collection(YoutubeChannelCollectionPath);

  let createNum = 0;
  let existNum = 0;
  let skipNum = 0;

  for (const item of channelItems) {
    const {
      id,
      snippet: { country },
    } = item;

    if (check && country !== "JP") {
      skipNum += 1;
      continue;
    }

    const data = formatChannelData(item);
    if (check && data.statistics.subscriberCount < 10000 && data.statistics.viewCount < 1000000) {
      skipNum += 1;
      continue;
    }

    const youtubeRef = youtubeChannelCollection.doc(id);

    let accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeRef).limit(1).get();

    if (!accountDocs.empty) {
      existNum += 1;
      continue;
    }

    const accountData: IAccountData = {
      tmpUsername: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      youtubeMainRef: youtubeRef,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await accountCollection.doc().set(accountData, { merge: true });
    accountDocs = await accountCollection.where("youtubeMainRef", "==", youtubeRef).limit(1).get();

    let accountId: string;
    accountDocs.forEach((doc) => {
      accountId = doc.id;
    });

    await updateChannel(accountId, data);

    createNum += 1;
  }

  console.log("createNum:", createNum, "existNum:", existNum, "skipNum:", skipNum);
};
