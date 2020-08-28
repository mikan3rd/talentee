import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";
import { getUserByUsername } from "../twitterFunc/common/api";

import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async () => {
  const linkUrls = await crawlOtherServiceLink("UCHp2q2i85qt_9nn2H7AvGOw");

  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

  for (const serviceAccount of serviceAccounts) {
    const { serviceName, items } = serviceAccount;
    const firstItem = items[0];
    if (serviceName === "twitter") {
      const { data } = await getUserByUsername(firstItem.username);
      console.log(data);
    }
  }

  return serviceAccounts;
};
