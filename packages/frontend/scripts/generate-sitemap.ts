import fs from "fs";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
import globby from "globby";
import * as prettier from "prettier";
import "cross-fetch/polyfill";

import { GetSitemapDataDocument, GetSitemapDataQuery } from "@/graphql/generated";

dotenv.config({ path: ".env" });

const baseUrl = "https://talentee.jp";
const siteUpdatedAt = dayjs().format("YYYY-MM-DD");

(async () => {
  const client = new ApolloClient({
    uri: `${process.env.SERVER_APOLLO_URI}/graphql`,
    cache: new InMemoryCache(),
  });

  const {
    data: {
      getSitemapData: { accounts, youtubeVideoCategories, youtubeKeywords },
    },
  } = await client.query<GetSitemapDataQuery>({ query: GetSitemapDataDocument });

  const pages = await globby(["pages/**/*.tsx", "!pages/_*.tsx", "!pages/account", "!pages/youtube"]);
  const youtubePages = youtubeVideoCategories.map((category) => `/youtube/${category.id}`);
  const youtubeKeywordPages = youtubeKeywords.map((keyword) => `/youtube/keyword/${keyword.title}/page/1`);
  const accountPages = accounts.map((accout) => `/account/${accout.uuid}`);

  const allPages = [...pages, ...youtubePages, ...youtubeKeywordPages, ...accountPages];

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

  const formattedSiteMap = prettier.format(sitemap, { parser: "html" });
  fs.writeFileSync("public/sitemap.xml", formattedSiteMap);

  const robots = `User-agent: *
Sitemap: ${baseUrl}/sitemap.xml
`;
  fs.writeFileSync("public/robots.txt", robots);
})();
