import { crawlSearchTweet } from "./common/crawlSearchTweet";
import { getTweetIdByUrl } from "./common/getTweetIdByUrl";

export const getPopularTweet = async () => {
  const username = "monst_mixi";
  const linkUrls = await crawlSearchTweet(username);
  console.log(linkUrls);
  const tweetIds = linkUrls.map((url) => getTweetIdByUrl(url));
  console.log(tweetIds);
};
