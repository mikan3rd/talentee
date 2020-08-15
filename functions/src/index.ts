import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";

import "dayjs/locale/ja";
dayjs.locale("ja");

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

import { savePopularChannel } from "./savePopularChannel";

export const getYoutubePopularChannelWeekly = functions
  .region("asia-northeast1")
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    const publishedAfter = dayjs().subtract(1, "week");
    const result = await savePopularChannel(publishedAfter);
    return result;
  });

export const getYoutubePopularChannelMonthly = functions
  .region("asia-northeast1")
  .runWith({ timeoutSeconds: 120 })
  .pubsub.schedule("0 1 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    const publishedAfter = dayjs().subtract(1, "month");
    const result = await savePopularChannel(publishedAfter);
    return result;
  });

export const getYoutubePopularChannelWeeklyTest = functions
  .region("asia-northeast1")
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "week");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });

export const getYoutubePopularChannelMonthlyTest = functions
  .region("asia-northeast1")
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "month");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });

export const getYoutubePopularChannelYearlyTest = functions
  .region("asia-northeast1")
  .runWith({ timeoutSeconds: 120 })
  .https.onRequest(async (req, res) => {
    const publishedAfter = dayjs().subtract(1, "year");
    const result = await savePopularChannel(publishedAfter);
    res.send({ result });
  });
