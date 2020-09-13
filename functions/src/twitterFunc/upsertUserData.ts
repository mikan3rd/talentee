import { formatTwitterUserData } from "./common/formatUserData";
import { TwitterError, TwitterNotFound, getUserByUsername } from "./common/api";
import { updateTwitterUser } from "./common/updateTwitterUser";

export const upsertUserData = async (accountId: string, username: string) => {
  console.log(`accountId: ${accountId}, username: ${username}`);

  let userObject: TwitterUserObjectType;

  try {
    const { data } = await getUserByUsername(username);
    userObject = data;
  } catch (e) {
    if (e instanceof TwitterError && e.name === TwitterNotFound) {
      return false;
    } else {
      throw e;
    }
  }

  const twitterUser = formatTwitterUserData(userObject);

  if (!accountId || !userObject.id) {
    console.error(`NOT FOUND: accountId: ${accountId}, username: ${username}`);
    return false;
  }

  await updateTwitterUser(accountId, twitterUser);

  return true;
};
