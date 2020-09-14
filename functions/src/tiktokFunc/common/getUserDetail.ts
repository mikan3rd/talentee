import * as cheerio from "cheerio";

import { puppeteerSetup } from "../../common/utils";

type ItemListResponseType = { items: TiktokItemType[] };

type ContentDataType = {
  props: { pageProps: { userInfo: TiktokUserType; userData } };
};

export const getUserDetail = async (uniqueId: string) => {
  const { browser, page } = await puppeteerSetup();

  let itemListResponse: ItemListResponseType;

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.continue();
  });
  page.on("requestfinished", async (request) => {
    const requestUrl = request.url();
    const resourceType = request.resourceType();
    const response = request.response();
    if (resourceType === "xhr" && requestUrl.includes("t.tiktok.com/api/item_list")) {
      itemListResponse = (await response.json()) as ItemListResponseType;
    }
  });

  const url = `https://www.tiktok.com/@${uniqueId}`;
  const response = await page.goto(url, { waitUntil: "networkidle2" });
  const responseBody = await response.text();

  await browser.close();

  const $ = cheerio.load(responseBody);
  const DataSelector = "script#__NEXT_DATA__";
  const content = $(DataSelector).html();

  const contentData = JSON.parse(content) as ContentDataType;
  const { userInfo } = contentData.props.pageProps;
  console.log(JSON.stringify(userInfo));

  return { userData: userInfo, itemList: itemListResponse.items || [] };
};
