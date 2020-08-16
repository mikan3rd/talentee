import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";

import "dayjs/locale/ja";
dayjs.locale("ja");

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

import { savePopularChannel } from "./savePopularChannel";
import { savePopularVideo } from "./savePopularVideo";
import { getChannelPopularVideo } from "./getChannelPopularVideo";
import { getTrendVideoIds } from "./getTrendVideoIds";
import { saveTrendChannel } from "./saveTrendChannel";
import { deleteChannel } from "./tmpFunc/deleteChannel";

const REGION = "asia-northeast1" as const;
const TIMEZONE = "Asia/Tokyo" as const;

export const getYoutubeTrendChannelScheduler = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 240, memory: "512MB" })
  .pubsub.schedule("0 0 * * *")
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    await saveTrendChannel();
  });

export const getYoutubePopularChannelWeekly = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule("0 1 * * *")
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    const publishedAfter = dayjs().subtract(1, "week");
    await savePopularChannel(publishedAfter);
  });

export const getYoutubePopularChannelMonthly = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule("0 2 * * *")
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    const publishedAfter = dayjs().subtract(1, "month");
    await savePopularChannel(publishedAfter);
  });

export const savePopularVideoScheduler = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 300, memory: "512MB" })
  .pubsub.schedule("0 3 * * *")
  .timeZone(TIMEZONE)
  .onRun(async (context) => {
    await savePopularVideo();
  });

export const getYoutubePopularChannelWeeklyTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "week");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });

export const getYoutubePopularChannelMonthlyTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "month");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });

export const getYoutubePopularChannelYearlyTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "year");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });

export const getChannelVideoTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 120, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    const result = await getChannelPopularVideo("UCFOsYGDAw16cr57cCqdJdVQ");
    res.send({ result });
  });

export const getTrendVideoIdsTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 180, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    const result = await getTrendVideoIds();
    res.send({ result });
  });

export const getYoutubeTrendChannelTest = functions
  .region(REGION)
  .runWith({ timeoutSeconds: 240, memory: "512MB" })
  .https.onRequest(async (req, res) => {
    const result = await saveTrendChannel();
    res.send({ result });
  });

export const deleteChannelTmp = functions.region(REGION).https.onRequest(async (req, res) => {
  const result = await deleteChannel();
  res.send({ result });
});
