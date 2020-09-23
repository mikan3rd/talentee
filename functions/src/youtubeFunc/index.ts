import dayjs from "dayjs";

import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import {
  PopularVideoJsonType,
  PopularVideoTopic,
  ServiceAccountByYoutubeJsonType,
  ServiceAccountByYoutubeTopic,
  UpsertYoutubeChannelJsonType,
  UpsertYoutubeChannelTopic,
} from "../firebase/topic";

import { getVideoCategories } from "./common/getVideoCategories";
import { savePopularChannel } from "./savePopularChannel";
import { upsertChannelData } from "./upsertChannelData";
import { updateVideo } from "./updateVideo";
import { saveTrendChannel } from "./saveTrendChannel";
import { getServiceAccount } from "./getServiceAccount";
import { getChannelPopularVideo } from "./common/getChannelPopularVideo";
import { getTrendVideoIds } from "./common/getTrendVideoIds";
// import { deleteChannel } from "./tmpFunc/deleteChannel";
// import { saveAllChannelVideo } from "./tmpFunc/saveAllChannelVideo";
// import { batchGetServiceAccount } from "./tmpFunc/batchGetServiceAccount";

export const getYoutubeTrendChannelScheduler = scheduleFunctions({ memory: "1GB" })("0 0,12 * * *").onRun(
  sentryWrapper(async (context) => {
    await saveTrendChannel();
  }),
);

export const getYoutubePopularChannelWeekly = scheduleFunctions()("0 1 * * *").onRun(
  sentryWrapper(async (context) => {
    const publishedAfter = dayjs().subtract(1, "week");
    await savePopularChannel(publishedAfter);
  }),
);

export const getYoutubePopularChannelMonthly = scheduleFunctions()("0 2 * * *").onRun(
  sentryWrapper(async (context) => {
    const publishedAfter = dayjs().subtract(1, "month");
    await savePopularChannel(publishedAfter);
  }),
);

export const upsertChannelPubsub = functions.pubsub.topic(UpsertYoutubeChannelTopic).onPublish(
  sentryWrapper(async (message) => {
    const { accountId, channelId } = message.json as UpsertYoutubeChannelJsonType;
    return await upsertChannelData(accountId, channelId);
  }),
);

export const updateVideoPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 10 })
  .pubsub.topic(PopularVideoTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      return await updateVideo(message.json as PopularVideoJsonType);
    }),
  );

export const getServiceAccountPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 3 })
  .pubsub.topic(ServiceAccountByYoutubeTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      const { channelId } = message.json as ServiceAccountByYoutubeJsonType;
      return await getServiceAccount(channelId);
    }),
  );

// ----- TEST ------
export const getYoutubePopularChannelWeeklyTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "week");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getYoutubePopularChannelMonthlyTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "month");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getYoutubePopularChannelYearlyTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "year");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getChannelVideoTest = functions.runWith({ memory: "512MB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await getChannelPopularVideo("UCFOsYGDAw16cr57cCqdJdVQ");
    res.send({ result });
  }),
);

export const getTrendVideoIdsTest = functions.runWith({ memory: "1GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await getTrendVideoIds();
    res.send({ result });
  }),
);

export const getYoutubeTrendChannelTest = functions.runWith({ memory: "1GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await saveTrendChannel();
    res.send({ result });
  }),
);

export const getVideoCategoriesTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const categories = await getVideoCategories();
    const result = categories
      .filter((category) => category.snippet.assignable)
      .map((category) => ({ text: category.snippet.title, value: category.id }));
    res.send({ result });
  }),
);

export const getServiceAccountTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const channelId = "UCHp2q2i85qt_9nn2H7AvGOw";
    const result = await getServiceAccount(channelId);
    res.send(result);
  }),
);

// ===== TMP =====
// export const deleteChannelTmp = functions.https.onRequest(
//   sentryWrapper(async (req, res) => {
//     const result = await deleteChannel();
//     res.send({ result });
//   }),
// );

// export const saveAllChannelVideoTmp = functions.runWith({ memory: "1GB" }).https.onRequest(
//   sentryWrapper(async (req, res) => {
//     const result = await saveAllChannelVideo();
//     res.send({ result });
//   }),
// );

// export const batchGetServiceAccountTmp = functions.https.onRequest(
//   sentryWrapper(async (req, res) => {
//     await batchGetServiceAccount();
//     res.send();
//   }),
// );
