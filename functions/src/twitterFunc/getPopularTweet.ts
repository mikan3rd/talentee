import { crawlSearchTweet } from "./common/crawlSearchTweet";
import { getTweetIdByUrl } from "./common/getTweetIdByUrl";
import { getTweets } from "./common/api";

export const getPopularTweet = async () => {
  const username = "monst_mixi";
  const linkUrls = await crawlSearchTweet(username);
  const tweetIds = linkUrls.map((url) => getTweetIdByUrl(url));
  console.log(JSON.stringify({ tweetIds }));

  const { data } = await getTweets(tweetIds);
  console.log(data);
};
