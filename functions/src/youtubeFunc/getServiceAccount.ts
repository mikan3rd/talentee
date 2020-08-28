import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";
import { getUserByUsername } from "../twitterFunc/common/api";
import { formatTwitterUserData } from "../twitterFunc/common/formatUserData";
import { upsertTwitterUserByChannelId } from "../twitterFunc/common/saveTwitterUser";

import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async () => {
  const channelId = "UC-ASnhD1JXr-AISPr0tv_OA";
  const linkUrls = await crawlOtherServiceLink(channelId);

  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

  for (const serviceAccount of serviceAccounts) {
    const { serviceName, items } = serviceAccount;
    const firstItem = items[0];
    if (serviceName === "twitter") {
      const {
        data: { data },
      } = await getUserByUsername(firstItem.username);
      const twitterUser = formatTwitterUserData(data);
      await upsertTwitterUserByChannelId(twitterUser, channelId);
    }
  }

  return serviceAccounts;
};
