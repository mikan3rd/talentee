import { puppeteerSetup } from "../../common/utils";

type SearchResponseType = {
  globalObjects: {
    tweets: {
      [tweetId: string]: { id_str: string };
    };
  };
};

export const crawlSearchTweet = async (username: string) => {
  const { browser, page } = await puppeteerSetup();

  let searchResponse: SearchResponseType;

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.continue();
  });
  page.on("requestfinished", async (request) => {
    const requestUrl = request.url();
    const resourceType = request.resourceType();
    const response = request.response();
    if (resourceType === "xhr" && requestUrl.includes("api.twitter.com/2/search")) {
      searchResponse = (await response.json()) as SearchResponseType;
    }
  });

  let minRetweets = 1000;
  let targetUrl = encodeURI(`https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`);
  console.log(targetUrl);
  await page.goto(targetUrl, { waitUntil: "networkidle2" });

  if (!searchResponse || !searchResponse.globalObjects) {
    minRetweets = 100;
    targetUrl = encodeURI(`https://twitter.com/search?q=from:${username} min_retweets:${minRetweets}`);
    console.log(targetUrl);
    await page.goto(targetUrl, { waitUntil: "networkidle2" });
  }

  await browser.close();

  if (!searchResponse || !searchResponse.globalObjects) {
    return [];
  }

  const tweetIds = Object.values(searchResponse.globalObjects.tweets).map((tweet) => tweet.id_str);
  console.log(JSON.stringify(tweetIds));
  return tweetIds;
};
