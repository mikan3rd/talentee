import { crawlSearchTweet } from "./common/crawlSearchTweet";

export const getPopularTweet = async () => {
  const username = "monst_mixi";
  const linkUrls = await crawlSearchTweet(username);
  console.log(linkUrls);
};
