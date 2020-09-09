import * as admin from "firebase-admin";
import * as dayjs from "dayjs";
import * as Sentry from "@sentry/node";
import "dayjs/locale/ja";

import { SENTRY_DSN, SENTRY_ENV } from "./common/config";

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN, environment: SENTRY_ENV });
}

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

dayjs.locale("ja");

export * from "./accountFunc";
export * from "./youtubeFunc";
export * from "./twitterFunc";
export * from "./instagramFunc";
export * from "./tiktokFunc";
