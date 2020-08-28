export const judgeServiceAccount = (url: string) => {
  const pathArray = url.split("/").reverse();
  let username = pathArray.find((path) => !!path);

  let serviceName: null | "twitter" | "instagram" | "nicovideo_channel" | "nicovideo_user" | "tiktok" = null;
  if (/twitter.com/.test(url)) {
    serviceName = "twitter" as const;
  } else if (/instagram.com/.test(url)) {
    serviceName = "instagram" as const;
  } else if (/ch.nicovideo.jp/.test(url)) {
    serviceName = "nicovideo_channel" as const;
  } else if (/nicovideo.jp/.test(url)) {
    serviceName = "nicovideo_user" as const;
  } else if (/tiktok.com/.test(url)) {
    serviceName = "tiktok" as const;
    username = username.replace("@", "");
  }

  const result = {
    serviceName,
    username,
    url,
  };
  console.log(result);
  return result;
};
