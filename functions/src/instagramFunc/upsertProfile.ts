import { crawlProfile } from "./common/crawlProfile";

export const upsertProfile = async (accoundId: string, username: string) => {
  const profileData = await crawlProfile(username);
};
