import { formatUserData } from "./common/formatUserData";
import { getUserDetail } from "./common/getUserDetail";
import { upsertItem } from "./common/upsertItem";
import { upsertUser } from "./common/upsertUser";

export const upsertUserData = async (accountId: string, uniqueId: string) => {
  console.log(`accountId: ${accountId}, uniqueId: ${uniqueId}`);
  const { userData, itemList } = await getUserDetail(uniqueId);

  console.log("itemList:", itemList.length);

  const formattedUserData = formatUserData(userData);

  const {
    user: { id },
  } = formattedUserData;

  if (!accountId || !id) {
    console.error(`NOT FOUND: accountId: ${accountId}, uniqueId: ${uniqueId}`);
    return false;
  }

  await upsertUser(accountId, formattedUserData);
  await upsertItem(itemList);

  return true;
};
