/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

require("dotenv").config({ path: ".env.local" });

const dayjs = require("dayjs");
const admin = require("firebase-admin");
const globby = require("globby");
const prettier = require("prettier");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const baseUrl = "https://talentee.jp";
const siteUpdatedAt = dayjs().format("YYYY-MM-DD");

const VideoCategorieOptions = [
  { text: "すべてのカテゴリ", value: "all" },
  { text: "映画とアニメ", value: "1" },
  { text: "自動車と乗り物", value: "2" },
  { text: "音楽", value: "10" },
  { text: "ペットと動物", value: "15" },
  { text: "スポーツ", value: "17" },
  { text: "旅行とイベント", value: "19" },
  { text: "ゲーム", value: "20" },
  { text: "ブログ", value: "22" },
  { text: "コメディー", value: "23" },
  { text: "エンターテイメント", value: "24" },
  { text: "ニュースと政治", value: "25" },
  { text: "ハウツーとスタイル", value: "26" },
  { text: "教育", value: "27" },
  { text: "科学と技術", value: "28" },
];

(async () => {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby(["pages/**/*.tsx", "!pages/_*.tsx", "!pages/account", "!pages/youtube"]);
  const youtubePages = VideoCategorieOptions.map((option) => `/youtube/${option.value}`);
  const accountPages = [];

  const db = admin.firestore();
  const youtubeDocs = await db
    .collection("youtubeChannel")
    .orderBy("statistics.subscriberCount", "desc")
    .limit(100)
    .get();
  youtubeDocs.forEach((doc) => {
    const { accountRef } = doc.data();
    const accountPath = `/account/${accountRef.id}`;
    accountPages.push(accountPath);
  });

  const twitterDocs = await db
    .collection("twitterUser")
    .orderBy("public_metrics.followers_count", "desc")
    .limit(100)
    .get();
  twitterDocs.forEach((doc) => {
    const { accountRef } = doc.data();
    const accountPath = `/account/${accountRef.id}`;
    accountPages.push(accountPath);
  });

  const instagramDocs = await db.collection("instagramUser").orderBy("edge_followed_by.count", "desc").limit(100).get();
  instagramDocs.forEach((doc) => {
    const { accountRef } = doc.data();
    const accountPath = `/account/${accountRef.id}`;
    accountPages.push(accountPath);
  });

  // Combine them into the pages you care about
  const allPages = [...pages, ...youtubePages, ...accountPages];

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const path = page.replace("pages", "").replace(".tsx", "");
      const route = path === "/index" ? "" : path;
      return `
<url>
  <loc>${baseUrl}${route}</loc>
  <lastmod>${siteUpdatedAt}</lastmod>
  <changefreq>daily</changefreq>
</url>`;
    })
    .join("")}
</urlset>
`;

  const robots = `User-agent: *
Sitemap: ${baseUrl}/sitemap.xml`;

  const formattedSiteMap = prettier.format(sitemap, {
    parser: "html",
  });

  fs.writeFileSync("public/sitemap.xml", formattedSiteMap);
  fs.writeFileSync("public/robots.txt", robots);
})();
