import puppeteer from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

import { UserAgent, getPuppeteerOptions } from "../../common/utils";

type shareDataType = {
  entry_data: { ProfilePage: { graphql: { user: InstagramUserType } }[] };
};
interface customWindow extends Window {
  _sharedData;
}

let window: customWindow;

export const crawlProfile = async (username: string) => {
  const browser = await puppeteer.use(StealthPlugin()).launch(getPuppeteerOptions());
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({ "Accept-Language": "ja-JP" });
  await page.setUserAgent(UserAgent);

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    // const resouceUrl = request.url();
    const abortCondition = ["image", "stylesheet", "font", "xhr", "manifest"].includes(resourceType);
    if (request.isNavigationRequest() && request.redirectChain().length) {
      console.log("REDIRECT!!");
      request.continue();
    } else if (abortCondition) {
      request.abort();
    } else {
      request.continue();
    }
  });

  const targetUrl = `https://www.instagram.com/${username}/`;
  console.log(targetUrl);
  await page.goto(targetUrl, { timeout: 1000 * 120 });

  const sharedData: shareDataType = JSON.parse(await page.evaluate(() => JSON.stringify(window._sharedData)));
  const user = sharedData.entry_data.ProfilePage[0].graphql.user;

  await browser.close();

  delete user.edge_owner_to_timeline_media;
  delete user.edge_related_profiles;
  delete user.edge_felix_video_timeline;
  delete user.edge_media_collections;
  delete user.edge_mutual_followed_by;
  delete user.edge_saved_media;

  console.log(JSON.stringify(user));

  return user;
};
