import { crawlOtherServiceLink } from "./common/crawlOtherServiceLink";

export const getServiceAccount = async () => {
  const linkUrls = await crawlOtherServiceLink("UCMJiPpN_09F0aWpQrgbc_qg");

  return linkUrls;
};
