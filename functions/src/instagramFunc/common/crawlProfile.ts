import { puppeteerSetup } from "../../common/utils";
import { INSTAGRAM_PASSWORD, INSTAGRAM_USERNAME } from "../../common/config";

type shareDataType = {
  entry_data: { ProfilePage: { graphql: { user: InstagramUserType } }[] };
};
interface customWindow extends Window {
  _sharedData;
}

let window: customWindow;

export const crawlProfile = async (username: string) => {
  const { browser, page } = await puppeteerSetup();

  const targetUrl = `http://www.instagram.com/${username}/`;
  console.log(targetUrl);
  await page.goto(targetUrl, { timeout: 1000 * 120, waitUntil: ["load", "networkidle2"] });

  const firstUrl = page.url();
  console.log("firstUrl:", firstUrl);

  if (firstUrl.includes("login")) {
    console.log("LOGIN: start");
    const UsernameSelector = "input[name=username]";
    const PasswordSelector = "input[name=password]";

    await page.waitForSelector(UsernameSelector);
    await page.waitForSelector(PasswordSelector);

    await page.type(UsernameSelector, INSTAGRAM_USERNAME);
    await page.type(PasswordSelector, INSTAGRAM_PASSWORD);

    await Promise.all([page.keyboard.press("Enter"), page.waitForNavigation()]);
    console.log("LOGIN: end");
  }

  const secondUrl = page.url();
  console.log("secondUrl:", secondUrl);

  if (secondUrl.includes("onetap")) {
    console.log("ONETAP: start");
    const ButtonSelector = "main section button";
    await page.waitFor(ButtonSelector);
    await Promise.all([page.click(ButtonSelector), page.waitForNavigation()]);
    console.log("ONETAP: end");
  }

  const thirdUrl = page.url();
  console.log("thirdUrl:", thirdUrl);

  // const imageBuffer = await page.screenshot();
  // return imageBuffer;

  const sharedData: shareDataType = JSON.parse(await page.evaluate(() => JSON.stringify(window._sharedData)));

  const user = sharedData.entry_data.ProfilePage[0].graphql.user;

  await browser.close();

  const {
    edge_owner_to_timeline_media,
    edge_felix_video_timeline,
    edge_media_collections,
    edge_mutual_followed_by,
    edge_saved_media,
  } = user;

  user.edge_owner_to_timeline_media = { count: edge_owner_to_timeline_media.count };
  user.edge_felix_video_timeline = { count: edge_felix_video_timeline.count };
  user.edge_media_collections = { count: edge_media_collections.count };
  user.edge_mutual_followed_by = { count: edge_mutual_followed_by.count };
  user.edge_saved_media = { count: edge_saved_media.count };
  delete user.edge_related_profiles;

  console.log(JSON.stringify(user));

  return user;
};
