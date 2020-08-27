import * as dayjs from "dayjs";

import { functions, scheduleFunctions } from "../firebase/functions";
import { PopularVideoJsonType, PopularVideoTopic } from "../firebase/topic";
import { sentryWrapper } from "../common/sentry";

import { getVideoCategories } from "./common/getVideoCategories";
import { savePopularChannel } from "./savePopularChannel";
import { updateRecentVideo } from "./updateRecentVideo";
import { updateVideo } from "./updateVideo";
import { saveTrendChannel } from "./saveTrendChannel";
import { getChannelPopularVideo } from "./common/getChannelPopularVideo";
import { getTrendVideoIds } from "./common/getTrendVideoIds";
import { deleteChannel } from "./tmpFunc/deleteChannel";
import { saveAllChannelVideo } from "./tmpFunc/saveAllChannelVideo";

export const getYoutubeTrendChannelScheduler = scheduleFunctions({ timeoutSeconds: 540, memory: "2GB" })(
  "0 0,12 * * *",
).onRun(
  sentryWrapper(async (context) => {
    await saveTrendChannel();
  }),
);

export const getYoutubePopularChannelWeekly = scheduleFunctions({ timeoutSeconds: 120 })("0 1 * * *").onRun(
  sentryWrapper(async (context) => {
    const publishedAfter = dayjs().subtract(1, "week");
    await savePopularChannel(publishedAfter);
  }),
);

export const getYoutubePopularChannelMonthly = scheduleFunctions({ timeoutSeconds: 120 })("0 2 * * *").onRun(
  sentryWrapper(async (context) => {
    const publishedAfter = dayjs().subtract(1, "month");
    await savePopularChannel(publishedAfter);
  }),
);

export const updateRecentVideoScheduler = scheduleFunctions({ timeoutSeconds: 300, memory: "512MB" })(
  "0 3 * * *",
).onRun(
  sentryWrapper(async (context) => {
    await updateRecentVideo();
  }),
);

export const updateVideoPubSub = functions
  .runWith({ timeoutSeconds: 540, memory: "2GB" })
  .pubsub.topic(PopularVideoTopic)
  .onPublish(
    sentryWrapper(async (message) => {
      return await updateVideo(message.json as PopularVideoJsonType);
    }),
  );

export const getYoutubePopularChannelWeeklyTest = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "week");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getYoutubePopularChannelMonthlyTest = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "month");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getYoutubePopularChannelYearlyTest = functions.runWith({ timeoutSeconds: 120 }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "year");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  }),
);

export const getChannelVideoTest = functions.runWith({ timeoutSeconds: 120, memory: "512MB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await getChannelPopularVideo("UCFOsYGDAw16cr57cCqdJdVQ");
    res.send({ result });
  }),
);

export const getTrendVideoIdsTest = functions.runWith({ timeoutSeconds: 540, memory: "2GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await getTrendVideoIds();
    res.send({ result });
  }),
);

export const getYoutubeTrendChannelTest = functions.runWith({ timeoutSeconds: 540, memory: "2GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await saveTrendChannel();
    res.send({ result });
  }),
);

export const updateRecentVideoTest = functions.runWith({ timeoutSeconds: 300, memory: "512MB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await updateRecentVideo();
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

export const deleteChannelTmp = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await deleteChannel();
    res.send({ result });
  }),
);

export const saveAllChannelVideoTmp = functions.runWith({ timeoutSeconds: 540, memory: "1GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await saveAllChannelVideo();
    res.send({ result });
  }),
);
