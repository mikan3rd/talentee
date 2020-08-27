import * as dayjs from "dayjs";
import * as admin from "firebase-admin";

import "dayjs/locale/ja";
dayjs.locale("ja");

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export * from "./youtubeFunc";
