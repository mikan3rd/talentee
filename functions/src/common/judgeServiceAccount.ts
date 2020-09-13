import { groupByObject } from "../common/utils";

export type serviceNameType =
  | "twitter"
  | "instagram"
  | "nicovideo_channel"
  | "nicovideo_user"
  | "tiktok"
  | "tiktok_vt"
  | "other";

export const bulkJudgeServiceAccount = (urls: string[]) => {
  const accounts = urls.map((url) => judgeServiceAccount(url));
  const result = groupByObject(accounts, (account) => account.serviceName).map(([serviceName, items]) => {
    return { serviceName, items: items.map((item, index) => ({ ...item, num: index + 1 })) };
  });
  return result;
};

export const judgeServiceAccount = (url: string) => {
  let pathname = "";
  try {
    pathname = new URL(url).pathname;
  } catch (e) {
    console.error(e);
    return {
      serviceName: "other",
      username: "",
      url,
    };
  }
  const pathArray = pathname.split("/").reverse();
  let username = pathArray.find((path) => !!path) || "";

  let serviceName: serviceNameType = "other";
  if (/twitter.com/.test(url)) {
    serviceName = "twitter" as const;
    username = username.replace("@", "");
  } else if (/instagram.com/.test(url)) {
    serviceName = "instagram" as const;
  } else if (/ch.nicovideo.jp/.test(url)) {
    serviceName = "nicovideo_channel" as const;
  } else if (/nicovideo.jp/.test(url)) {
    serviceName = "nicovideo_user" as const;
  } else if (/v?t.tiktok.com/.test(url)) {
    serviceName = "tiktok_vt" as const;
    username = username.replace("@", "");
  } else if (/tiktok.com/.test(url)) {
    serviceName = "tiktok" as const;
    username = username.replace("@", "");
  }

  const result = {
    serviceName,
    username,
    url,
  };
  console.log(JSON.stringify(result));
  return result;
};
