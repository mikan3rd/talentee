import dayjs from "dayjs";

import { sentryWrapper } from "../common/sentry";
import { functions, scheduleFunctions } from "../firebase/functions";
import { PopularVideoJsonType, Topic, UpsertYoutubeChannelJsonType } from "../firebase/topic";

import { addChannelByYouturaDaily, addChannelByYouturaMonthly } from "./addChannelByYoutura";
import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";
import { getChannelPopularVideo } from "./common/getChannelPopularVideo";
import { savePopularChannel } from "./savePopularChannel";
import { saveTrendChannel } from "./saveTrendChannel";
import { updateVideo } from "./updateVideo";
import { upsertChannelData } from "./upsertChannelData";

// export const getYoutubeTrendChannelScheduler = scheduleFunctions({ memory: "1GB" })("0 0,12 * * *").onRun(
//   sentryWrapper(async (context) => {
//     await saveTrendChannel();
//   }),
// );

// export const getYoutubePopularChannelWeekly = scheduleFunctions()("0 1 * * *").onRun(
//   sentryWrapper(async (context) => {
//     const publishedAfter = dayjs().subtract(1, "week");
//     await savePopularChannel(publishedAfter);
//   }),
// );

// export const getYoutubePopularChannelMonthly = scheduleFunctions()("0 2 * * *").onRun(
//   sentryWrapper(async (context) => {
//     const publishedAfter = dayjs().subtract(1, "month");
//     await savePopularChannel(publishedAfter);
//   }),
// );

export const addChannelByYouturaDailyScheduler = scheduleFunctions({ timeoutSeconds: 240 })("0 6 * * *").onRun(
  sentryWrapper(async (context) => {
    await addChannelByYouturaDaily();
  }),
);

export const addChannelByYouturaMonthlyScheduler = scheduleFunctions({ timeoutSeconds: 240 })("0 7 * * sun").onRun(
  sentryWrapper(async (context) => {
    await addChannelByYouturaMonthly();
  }),
);

export const upsertChannelPubsub = functions.pubsub.topic(Topic.UpsertYoutubeChannel).onPublish(
  sentryWrapper(async (message) => {
    const { accountId, channelId } = message.json as UpsertYoutubeChannelJsonType;
    return await upsertChannelData(accountId, channelId);
  }),
);

export const updateVideoPubSub = functions
  .runWith({ memory: "1GB", maxInstances: 10 })
  .pubsub.topic(Topic.PopularVideo)
  .onPublish(
    sentryWrapper(async (message) => {
      const { channelId, videoCategories } = message.json as PopularVideoJsonType;
      return await updateVideo(channelId, videoCategories);
    }),
  );

// ----- TEST ------
export const getChannelVideoTest = functions.runWith({ memory: "512MB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await getChannelPopularVideo("UCFOsYGDAw16cr57cCqdJdVQ");
    res.send({ result });
  }),
);

export const getYoutubeTrendChannelTest = functions.runWith({ memory: "1GB" }).https.onRequest(
  sentryWrapper(async (req, res) => {
    const result = await saveTrendChannel();
    res.send({ result });
  }),
);

export const crawlOtherServiceLinkTest = functions.https.onRequest(
  sentryWrapper(async (req, res) => {
    const channelId = "UCFOsYGDAw16cr57cCqdJdVQ";
    const result = await crawlOtherServiceLink(channelId);
    res.send({ result });
  }),
);
