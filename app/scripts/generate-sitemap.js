/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const globby = require("globby");
const prettier = require("prettier");
const dayjs = require("dayjs");

const baseUrl = "https://talentee.vercel.app";
const siteUpdatedAt = dayjs().format("YYYY-MM-DD");

(async () => {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby(["pages/**/*.tsx", "!pages/_*.tsx", "!pages/account"]);

  // Combine them into the pages you care about
  const allPages = [...pages];

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
