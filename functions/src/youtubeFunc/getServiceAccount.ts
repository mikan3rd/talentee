import { bulkJudgeServiceAccount } from "../common/judgeServiceAccount";

import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async () => {
  const linkUrls = await crawlOtherServiceLink("UCHp2q2i85qt_9nn2H7AvGOw");

  const serviceAccounts = bulkJudgeServiceAccount(linkUrls);

  return serviceAccounts;
};
