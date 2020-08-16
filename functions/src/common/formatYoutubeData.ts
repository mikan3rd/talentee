import { youtube_v3 } from "googleapis";

export const formatChannelData = (item: youtube_v3.Schema$Channel) => {
  const {
    id,
    snippet,
    statistics,
    brandingSettings: {
      channel: { keywords, ...channnelObjects },
      ...brandSettingObjects
    },
  } = item;

  const formattedStatistics = toNumber<{ subscriberCount: number; viewCount: number }>(statistics);

  const keywordArray: string[] = [];
  if (keywords) {
    let tmpKeyword = "";
    for (const keyword of keywords.split(/\s/)) {
      const separator = '"';
      const firstString = keyword.charAt(0);
      const lastString = keyword.slice(-1);
      if (firstString === separator) {
        tmpKeyword = keyword.substr(1);
        continue;
      }
      if (lastString === separator) {
        keywordArray.push(`${tmpKeyword} ${keyword.slice(0, -1)}`);
        tmpKeyword = "";
        continue;
      }
      if (tmpKeyword) {
        tmpKeyword += " " + keyword;
        continue;
      }
      keywordArray.push(keyword);
    }
  }

  const data = {
    id,
    snippet,
    statistics: formattedStatistics,
    brandingSettings: {
      ...brandSettingObjects,
      channel: { ...channnelObjects, keywords: keywordArray },
    },
  };
  return data;
};

export const formatVideoData = (item: youtube_v3.Schema$Video) => {
  const { id, snippet, statistics, contentDetails, player } = item;
  const formattedStatistics = toNumber(statistics);
  const data = {
    id,
    snippet,
    statistics: formattedStatistics,
    contentDetails,
    player,
  };
  return data;
};

const toNumber = <T>(targetObject: { [key: string]: any }) => {
  const formattedObject = {} as T;
  Object.entries(targetObject).forEach(([key, value]) => {
    if (typeof value === "string" && !isNaN(Number(value))) {
      formattedObject[key] = Number(value);
    } else {
      formattedObject[key] = value;
    }
  });
  return formattedObject;
};
