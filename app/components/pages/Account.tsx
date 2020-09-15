import React from "react";
import { css } from "@emotion/core";
import { Button, Divider, Icon, Menu } from "semantic-ui-react";
import dayjs from "dayjs";

import { YoutubeDetail } from "../organisms/YoutubeDetail";
import { TwitterDetail } from "../organisms/TwitterDetail";
import { TiktokDetail } from "../organisms/TiktokDetail";
import { InstagramDetail } from "../organisms/InstagramDetail";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const ServiceList = ["youtube", "twitter", "instagram", "tiktok"] as const;
export type ServiceType = typeof ServiceList[number];
export const ServiceYoutube = ServiceList[0];
export const ServiceTwitter = ServiceList[1];
export const ServiceInstagram = ServiceList[2];
export const ServiceTiktok = ServiceList[3];

const scrollToElement = (elementId: ServiceType) => {
  const header = document.getElementById("header");
  const tab = document.getElementById("service_tab");
  const target = document.getElementById(elementId);
  if (header && tab && target) {
    window.scrollTo({ top: target.offsetTop - header.clientHeight - tab.clientHeight, behavior: "smooth" });
  }
};

export const Account = React.memo<{
  accountData: AccountDataType;
  youtubeData?: IYoutubeData;
  youtubePopularVideos: IYoutubeVideoData[];
  twitterUserData?: TwitterUserDataType;
  popularTweets: TweetDataType[];
  instagramUserData?: InstagramUserDataType;
  instagramPopularMedia: InstagramMediaType[];
  tiktokUserData?: TiktokUserDataType;
  tiktokPopularItem: TiktokItemType[];
}>(
  ({
    accountData,
    youtubeData,
    youtubePopularVideos,
    twitterUserData,
    popularTweets,
    instagramUserData,
    instagramPopularMedia,
    tiktokUserData,
    tiktokPopularItem,
  }) => {
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const [selectedTab, setSelectedTab] = React.useState<ServiceType>(null);

    React.useEffect(() => {
      const headerHeight = document.getElementById("header").clientHeight;
      setHeaderHeight(headerHeight);
    }, []);

    const isUp = useScrollDirection();

    const { tmpUsername, thumbnailUrl, updatedAt } = accountData;

    const handleOnClickTab = (elementId: ServiceType) => {
      scrollToElement(elementId);
      setSelectedTab(elementId);
    };

    const updateAtTime = dayjs.unix(updatedAt);

    return (
      <>
        <div
          css={css`
            display: flex;
          `}
        >
          <img
            src={thumbnailUrl}
            alt={tmpUsername}
            css={css`
              width: 64px;
              height: 64px;
              border-radius: 50%;
              flex-shrink: 0;
            `}
          />
          <div
            css={css`
              margin-left: 10px;
            `}
          >
            <h1>{tmpUsername}</h1>
            <div>
              {youtubeData && (
                <Button
                  circular
                  color="youtube"
                  icon="youtube"
                  as="a"
                  href={`https://www.youtube.com/channel/${youtubeData.id}`}
                  target="_black"
                  css={LinkButtonCss}
                />
              )}

              {twitterUserData && (
                <Button
                  circular
                  color="twitter"
                  icon="twitter"
                  as="a"
                  href={`https://twitter.com/${twitterUserData.username}`}
                  target="_black"
                  css={LinkButtonCss}
                />
              )}

              {instagramUserData && (
                <Button
                  circular
                  color="black"
                  icon="instagram"
                  as="a"
                  href={`https://instagram.com/${instagramUserData.username}/`}
                  target="_black"
                  css={css`
                    ${LinkButtonCss}
                    &&& {
                      background: radial-gradient(
                        circle at 30% 107%,
                        #fdf497 0%,
                        #fdf497 5%,
                        #fd5949 45%,
                        #d6249f 60%,
                        #285aeb 90%
                      );
                    }
                  `}
                />
              )}

              {tiktokUserData && (
                <Button
                  circular
                  color="black"
                  as="a"
                  href={`https://www.tiktok.com/@${tiktokUserData.user.uniqueId}`}
                  target="_black"
                  css={LinkButtonCss}
                >
                  <img
                    src="/icon_tiktok.svg"
                    alt="icon_tiktok"
                    css={css`
                      width: 100%;
                    `}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          css={css`
            margin-top: 20px;
            text-align: right;
          `}
        >
          <Icon name="history" /> {updateAtTime.format("YYYY年M月D日")}
        </div>

        <Menu
          id="service_tab"
          pointing
          secondary
          css={css`
            &&& {
              position: sticky;
              top: ${isUp ? `${headerHeight}px` : 0};
              z-index: 1;
              margin-top: 20px;
              background-color: #f7f7f7;
              transition: all 0.5s ease;
              overflow-x: scroll;
              padding-bottom: 2px;
              .item {
                transition: all 0.5s ease !important;
              }
            }
          `}
        >
          {ServiceList.map((serviceName) => {
            console.log(serviceName);
            if (serviceName === ServiceYoutube && youtubeData) {
              return (
                <Menu.Item
                  key={serviceName}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                >
                  <Icon
                    name="youtube"
                    css={css`
                      color: red;
                    `}
                  />
                  YouTube
                </Menu.Item>
              );
            }
            if (serviceName === ServiceTwitter && twitterUserData) {
              return (
                <Menu.Item
                  key={serviceName}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                >
                  <Icon
                    name="twitter"
                    css={css`
                      color: #55acee;
                    `}
                  />
                  Twitter
                </Menu.Item>
              );
            }
            if (serviceName === ServiceInstagram && instagramUserData) {
              return (
                <Menu.Item
                  key={serviceName}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                >
                  <img src="/icon_instagram.svg" alt="icon_instagram" css={TabIconCss} />
                  Instagram
                </Menu.Item>
              );
            }
            if (serviceName === ServiceTiktok && tiktokUserData) {
              return (
                <Menu.Item
                  key={serviceName}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                >
                  <img src="/icon_tiktok_black.svg" alt="icon_tiktok" css={TabIconCss} />
                  TikTok
                </Menu.Item>
              );
            }
            return null;
          })}
        </Menu>

        {youtubeData && (
          <>
            <YoutubeDetail youtubeData={youtubeData} youtubePopularVideos={youtubePopularVideos} />
          </>
        )}

        {twitterUserData && (
          <>
            <Divider />
            <TwitterDetail twitterUserData={twitterUserData} popularTweets={popularTweets} />
          </>
        )}

        {instagramUserData && (
          <>
            <Divider />
            <InstagramDetail instagramUserData={instagramUserData} instagramPopularMedia={instagramPopularMedia} />
          </>
        )}

        {tiktokUserData && (
          <>
            <Divider />
            <TiktokDetail tiktokUserData={tiktokUserData} tiktokPopularItem={tiktokPopularItem} />
          </>
        )}

        <Divider />

        <div>
          <YoutubeIndexLinkButton />
          <TwitterIndexLinkButton />
          <InstagramIndexLinkButton />
          <TiktokIndexLinkButton />
        </div>

        <Divider />

        <IndexLinkButton />
      </>
    );
  },
);

const LinkButtonCss = css`
  &&& {
    margin-left: 10px;
    padding: 11px;
    &:first-of-type {
      margin-left: 0;
    }
    > * {
      width: 14px;
      height: 12px;
    }
  }
`;

const TabIconCss = css`
  &&& {
    width: 16px !important;
    height: 14px !important;
    margin-right: 5px !important;
  }
`;
