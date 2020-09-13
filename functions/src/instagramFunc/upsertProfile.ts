import { crawlProfile } from "./common/crawlProfile";
import { upsertUser } from "./common/upsertUser";
import { upsertMedia } from "./common/upsertMedia";

export const upsertProfile = async (accountId: string, username: string) => {
  console.log(`accountId: ${accountId}, username: ${username}`);
  const { userData, mediaDataList } = await crawlProfile(username);

  const { id } = userData;
  if (!accountId || !id) {
    console.error(`NOT FOUND: accountId: ${accountId}, username: ${username}`);
    return false;
  }

  await upsertUser(accountId, userData);
  await upsertMedia(mediaDataList);

  return true;
};
