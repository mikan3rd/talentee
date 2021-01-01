import React from "react";

import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Divider, Icon, Menu } from "semantic-ui-react";

import { useScrollDirection } from "../../hooks/useScrollDirection";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";
import {
  InstagramSocialButton,
  TiktokSocialButton,
  TwitterSocialButton,
  YoutubeSocialButton,
} from "../atoms/SocialButton";
import { InstagramDetail } from "../organisms/InstagramDetail";
import { TiktokDetail } from "../organisms/TiktokDetail";
import { TwitterDetail } from "../organisms/TwitterDetail";
import { YoutubeDetail } from "../organisms/YoutubeDetail";

const ServiceList = ["youtube", "twitter", "instagram", "tiktok"] as const;
type ServiceType = typeof ServiceList[number];
const ServiceYoutube = ServiceList[0];
const ServiceTwitter = ServiceList[1];
const ServiceInstagram = ServiceList[2];
const ServiceTiktok = ServiceList[3];

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
  youtubeData?: YoutubeData;
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

    const refs = React.useRef<HTMLDivElement[]>([]);

    React.useEffect(() => {
      // SSRの場合にdocumentを直で呼び出せないため
      const headerHeight = document.getElementById("header").clientHeight;
      setHeaderHeight(headerHeight);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const tmpId = entry.target.id as ServiceType;
              handleSelectedTab(tmpId);
            }
          });
        },
        { rootMargin: "-50% 0px" },
      );

      refs.current = refs.current.slice(0, ServiceList.length);
      refs.current.forEach((ele) => observer.observe(ele));

      return () => {
        refs.current.forEach((ele) => observer.unobserve(ele));
      };
    }, []);

    const isUp = useScrollDirection();

    const { tmpUsername, thumbnailUrl, updatedAt } = accountData;

    const handleSelectedTab = (elementId: ServiceType) => {
      const tabEle = document.getElementById("service_tab");
      const targetEle = document.getElementById(`service_tab_${elementId}`);
      tabEle.scrollTo({ left: targetEle.offsetLeft, behavior: "smooth" });
      setSelectedTab(elementId);
    };

    const handleOnClickTab = (elementId: ServiceType) => {
      scrollToElement(elementId);
      handleSelectedTab(elementId);
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
              {youtubeData && <YoutubeSocialButton channelId={youtubeData.id} />}
              {twitterUserData && <TwitterSocialButton username={twitterUserData.username} />}
              {instagramUserData && <InstagramSocialButton username={instagramUserData.username} />}
              {tiktokUserData && <TiktokSocialButton uniqueId={tiktokUserData.user.uniqueId} />}
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
            if (serviceName === ServiceYoutube && youtubeData) {
              return (
                <Menu.Item
                  key={serviceName}
                  id={`service_tab_${serviceName}`}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                  css={TabItemCss}
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
                  id={`service_tab_${serviceName}`}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                  css={TabItemCss}
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
                  id={`service_tab_${serviceName}`}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                  css={TabItemCss}
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
                  id={`service_tab_${serviceName}`}
                  active={serviceName === selectedTab}
                  onClick={() => handleOnClickTab(serviceName)}
                  css={TabItemCss}
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
            <div id={ServiceYoutube} ref={(el) => (refs.current[0] = el)}>
              <YoutubeDetail youtubeData={youtubeData} youtubePopularVideos={youtubePopularVideos} />
            </div>
          </>
        )}

        {twitterUserData && (
          <>
            <Divider />
            <div id={ServiceTwitter} ref={(el) => (refs.current[1] = el)}>
              <TwitterDetail twitterUserData={twitterUserData} popularTweets={popularTweets} />
            </div>
          </>
        )}

        {instagramUserData && (
          <>
            <Divider />
            <div id={ServiceInstagram} ref={(el) => (refs.current[2] = el)}>
              <InstagramDetail instagramUserData={instagramUserData} instagramPopularMedia={instagramPopularMedia} />
            </div>
          </>
        )}

        {tiktokUserData && (
          <>
            <Divider />
            <div id={ServiceTiktok} ref={(el) => (refs.current[3] = el)}>
              <TiktokDetail tiktokUserData={tiktokUserData} tiktokPopularItem={tiktokPopularItem} />
            </div>
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

const TabItemCss = css`
  &&& {
    height: 50px;
  }
`;

const TabIconCss = css`
  &&& {
    width: 16px !important;
    height: 14px !important;
    margin-right: 5px !important;
  }
`;
