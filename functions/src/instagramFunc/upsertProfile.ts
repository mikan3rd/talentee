import { crawlProfile } from "./common/crawlProfile";
import { upsertMedia } from "./common/upsertMedia";
import { upsertUser } from "./common/upsertUser";

export const upsertProfile = async (accountId: string, username: string) => {
  console.log(`accountId: ${accountId}, username: ${username}`);
  const { userData, mediaDataList } = await crawlProfile(username);

  console.log("mediaDataList:", mediaDataList.length);

  if (!accountId || !userData || !userData.id) {
    console.error(`NOT FOUND: accountId: ${accountId}, username: ${username}`);
    return false;
  }

  await upsertUser(accountId, userData);
  await upsertMedia(mediaDataList);

  return true;
};
