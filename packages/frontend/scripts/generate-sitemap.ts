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

(async () => {
  const client = new ApolloClient({
    uri: `${process.env.SERVER_APOLLO_URI}/graphql`,
    cache: new InMemoryCache(),
  });

  const {
    data: {
      getSitemapData: { accounts, youtubeVideoCategories, youtubeKeywords, youtubeTags },
    },
  } = await client.query<GetSitemapDataQuery>({ query: GetSitemapDataDocument });
  console.log(`accounts: ${accounts.length}`);
  console.log(`youtubeVideoCategories: ${youtubeVideoCategories.length}`);
  console.log(`youtubeKeywords: ${youtubeKeywords.length}`);
  console.log(`youtubeTags: ${youtubeTags.length}`);

  const pages = (
    await globby([
      "pages/**/*.tsx",
      "!pages/_*.tsx",
      "!pages/account",
      "!pages/youtube",
      "!pages/**/[page].tsx",
      "!pages/admin/*.tsx",
    ])
  ).map((page) => ({ path: page }));

  const youtubeCategoryPages = youtubeVideoCategories.map((category) => ({
    path: `/youtube/category/${category.id}`,
  }));
  youtubeCategoryPages.unshift({ path: `/youtube/category/all` });
  const youtubeKeywordPages = youtubeKeywords.map((keyword) => ({
    path: `/youtube/keyword/${encodeURIComponent(keyword.title)}`,
  }));
  const youtubevideoTagPages = youtubeTags.map((tag) => ({
    path: `/youtube/videoTag/${encodeURIComponent(tag.id)}`,
  }));
  const accountPages = accounts.map((account) => ({ path: `/account/${account.uuid}`, updatedAt: account.updatedAt }));

  const allPages: { path: string; updatedAt?: number }[] = [
    ...pages,
    ...accountPages,
    ...youtubeCategoryPages,
    ...youtubeKeywordPages,
    ...youtubevideoTagPages,
  ];
  console.log(`total: ${allPages.length}`);

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      const path = page.path.replace("pages", "").replace("/index", "").replace(".tsx", "");
      const url = `${baseUrl}${path}`;
      return `
<url>
  <loc>${url}</loc>${page.updatedAt ? `\n<lastmod>${dayjs.unix(page.updatedAt).format("YYYY-MM-DD")}</lastmod>` : ""}
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
