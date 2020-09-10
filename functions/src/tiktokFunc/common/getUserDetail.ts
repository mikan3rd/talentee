import * as cheerio from "cheerio";

import { axiosSetup } from "../../common/utils";

type ContentDataType = {
  props: { pageProps: { userInfo: TiktokUserType; userData } };
};

export const getUserDetail = async (uniqueId: string) => {
  const axios = axiosSetup();
  const url = `https://www.tiktok.com/@${uniqueId}`;
  const { data } = await axios.get<string>(url);

  const $ = cheerio.load(data);
  const DataSelector = "script#__NEXT_DATA__";
  const content = $(DataSelector).html();

  const contentData = JSON.parse(content) as ContentDataType;
  const { userInfo } = contentData.props.pageProps;
  console.log(JSON.stringify(userInfo));

  return userInfo;
};
