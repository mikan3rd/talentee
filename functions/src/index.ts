import * as functions from "firebase-functions";
import { google } from "googleapis";

const YOUTUBE_API_KEY = "";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.region("asia-northeast1").https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getYoytubePopularChannel = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  const service = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });
  const response = await service.search.list({
    part: ["id", "snippet"],
    type: ["video"],
    regionCode: "JP",
    relevanceLanguage: "ja",
    order: "viewCount",
    maxResults: 10,
  });
  res.send(response.data.items);
});
