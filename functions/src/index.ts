import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as admin from "firebase-admin";

import "dayjs/locale/ja";
dayjs.locale("ja");

admin.initializeApp();

import { savePopularChannel } from "./savePopularChannel";

export const getYoytubePopularChannel = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  const publishedAfter = dayjs().subtract(1, "week");
  const result = await savePopularChannel(publishedAfter);
  res.send({ result });
});
