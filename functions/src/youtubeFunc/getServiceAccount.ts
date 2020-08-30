import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";
import { TwitterError, TwitterNotFound, getUserByUsername } from "../twitterFunc/common/api";
import { formatTwitterUserData } from "../twitterFunc/common/formatUserData";
import { upsertTwitterUserByChannelId } from "../twitterFunc/common/upsertTwitterUserByChannelId";

import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async (channelId: string) => {
  const linkUrls = await crawlOtherServiceLink(channelId);

  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

  for (const serviceAccount of serviceAccounts) {
    const { serviceName, items } = serviceAccount;
    const firstItem = items[0];
    if (serviceName === "twitter") {
      if (!firstItem.username) {
        continue;
      }
      try {
        const { data } = await getUserByUsername(firstItem.username);
        const twitterUser = formatTwitterUserData(data);
        await upsertTwitterUserByChannelId(twitterUser, channelId);
      } catch (e) {
        if (e instanceof TwitterError && e.name === TwitterNotFound) {
          continue;
        } else {
          throw e;
        }
      }
    }
  }

  return serviceAccounts;
};
