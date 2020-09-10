import { axiosSetup } from "../../common/utils";

export const getTrendVideoIds = async () => {
  const baseUrl = `https://www.youtube.com`;
  const trendUrl = `${baseUrl}/feed/trending`;

  const axios = axiosSetup(true);
  const { data } = await axios.get<string>(trendUrl);

  // eslint-disable-next-line no-useless-escape
  const trendUrlReg = new RegExp(`/feed/trending\?[^"]*(?=")`, "g");
  const matchResults = data.match(trendUrlReg);
  if (!matchResults) {
    return null;
  }

  const trendUrls = Array.from(new Set(matchResults)).map((path) => `${baseUrl}${path}`);

  let videoIds: string[] = [];
  for (const url of trendUrls) {
    console.log(url);
    const { data } = await axios.get<string>(url);
    const videoMatchResults = data.match(/(?<=("\/watch\?v=))[^"]*(?=")/g);
    if (videoMatchResults) {
      videoIds = videoIds.concat(videoMatchResults);
    }
  }

  const uniqueVideoIds = Array.from(new Set(videoIds));
  console.log(JSON.stringify({ uniqueVideoIds }));
  return uniqueVideoIds;
};
