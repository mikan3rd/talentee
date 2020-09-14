import { getUserDetail } from "./common/getUserDetail";
import { upsertUser } from "./common/upsertUser";
import { upsertItem } from "./common/upsertItem";

export const upsertUserData = async (accountId: string, uniqueId: string) => {
  console.log(`accountId: ${accountId}, uniqueId: ${uniqueId}`);
  const { userData, itemList } = await getUserDetail(uniqueId);

  console.log("itemList:", itemList.length);

  const {
    user: { id },
  } = userData;
  if (!accountId || !id) {
    console.error(`NOT FOUND: accountId: ${accountId}, uniqueId: ${uniqueId}`);
    return false;
  }

  await upsertUser(accountId, userData);
  await upsertItem(itemList);

  return true;
};
