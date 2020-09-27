// import * as cheerio from "cheerio";

import { puppeteerSetup } from "../../common/utils";

type UserDetailResponseType = { userInfo: TiktokUserType };
type ItemListResponseType = { items: TiktokItemType[] };

// type ContentDataType = {
//   props: { pageProps: { userInfo: TiktokUserType; userData } };
// };

export const getUserDetail = async (uniqueId: string) => {
  const { browser, page } = await puppeteerSetup();

  let userDetailResponse: UserDetailResponseType;
  let itemListResponse: ItemListResponseType;

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.continue();
  });
  page.on("requestfinished", async (request) => {
    const requestUrl = request.url();
    const resourceType = request.resourceType();
    const response = request.response();
    if (resourceType === "xhr") {
      if (requestUrl.includes("t.tiktok.com/api/user/detail")) {
        userDetailResponse = (await response.json()) as UserDetailResponseType;
      }
      if (requestUrl.includes("t.tiktok.com/api/item_list")) {
        itemListResponse = (await response.json()) as ItemListResponseType;
      }
    }
  });

  const url = `https://www.tiktok.com/@${uniqueId}`;
  await page.goto(url, { waitUntil: "networkidle2" });
  // const response = await page.goto(url, { waitUntil: "networkidle2" });
  // const responseBody = await response.text();

  await browser.close();

  // const $ = cheerio.load(responseBody);
  // const DataSelector = "script#__NEXT_DATA__";
  // const content = $(DataSelector).html();
  // const contentData = JSON.parse(content) as ContentDataType;
  // const { userInfo } = contentData.props.pageProps;

  console.log(JSON.stringify(userDetailResponse.userInfo));

  return { userData: userDetailResponse.userInfo, itemList: itemListResponse.items || [] };
};
