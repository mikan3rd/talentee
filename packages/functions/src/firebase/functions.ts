import * as cloudFunctions from "firebase-functions";
export { logger } from "firebase-functions/lib";

const REGION = "asia-northeast1" as const;
const TIMEZONE = "Asia/Tokyo" as const;

export const functions = cloudFunctions.region(REGION);
export const scheduleFunctions = (runtimeOptions: cloudFunctions.RuntimeOptions = {}) => (schedule: string) =>
  functions.runWith(runtimeOptions).pubsub.schedule(schedule).timeZone(TIMEZONE).retryConfig({ retryCount: 1 });
