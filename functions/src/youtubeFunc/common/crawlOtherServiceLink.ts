import { axiosSetup } from "../../common/utils";

type ytInitialDataType = {
  contents: {
    twoColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer: {
          title: string;
          selected: boolean;
          content: {
            sectionListRenderer: {
              contents: {
                itemSectionRenderer: {
                  contents: {
                    channelAboutFullMetadataRenderer: {
                      primaryLinks: { title: string; navigationEndpoint: { urlEndpoint: { url: string } } }[];
                    };
                  }[];
                };
              }[];
            };
          };
        };
      }[];
    };
  };
};

export const crawlOtherServiceLink = async (channelId: string) => {
  const axios = axiosSetup();

  const targetUrl = `https://www.youtube.com/channel/${channelId}/about`;
  console.log(targetUrl);

  const { data } = await axios.get<string>(targetUrl);

  const matchResults = data.match(/{"responseContext":(.*})(?=(;))/);
  if (!matchResults) {
    return null;
  }

  const ytInitialData: ytInitialDataType = JSON.parse(matchResults[0]);

  const targetTab = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs.find((tab) => tab.tabRenderer.selected);
  if (!targetTab) {
    return [];
  }

  const targetSection = targetTab.tabRenderer.content.sectionListRenderer.contents[0];
  const targetItem = targetSection.itemSectionRenderer.contents[0];
  const linkUrls = targetItem.channelAboutFullMetadataRenderer.primaryLinks.map((link) => {
    const redirectUrl = link.navigationEndpoint.urlEndpoint.url;
    console.log(redirectUrl);
    const decodeUrl = decodeURIComponent(redirectUrl);
    const UrlObj = new URL(decodeUrl);
    const queryUrl = UrlObj.searchParams.get("q");
    if (queryUrl) {
      return queryUrl;
    }
    return `${UrlObj.origin}${UrlObj.pathname}`;
  });

  return linkUrls;
};
