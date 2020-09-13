/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

require("dotenv").config({ path: ".env.local" });

const admin = require("firebase-admin");
const globby = require("globby");
const prettier = require("prettier");
const dayjs = require("dayjs");

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

(async () => {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby(["pages/**/*.tsx", "!pages/_*.tsx", "!pages/account"]);

  const db = admin.firestore();
  const youtubeDocs = await db
    .collection("youtubeChannel")
    .orderBy("statistics.subscriberCount", "desc")
    .limit(100)
    .get();
  const accountPages = [];
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

  // Combine them into the pages you care about
  const allPages = [...pages, ...accountPages];

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
