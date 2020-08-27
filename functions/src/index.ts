import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as dayjs from "dayjs";
import * as Sentry from "@sentry/node";
import "dayjs/locale/ja";

const { dsn, environment } = functions.config().sentry;

Sentry.init({ dsn, environment });

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

dayjs.locale("ja");

export * from "./youtubeFunc";
