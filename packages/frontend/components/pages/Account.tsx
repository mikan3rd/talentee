import React from "react";

import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Divider, Icon, Menu } from "semantic-ui-react";

import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import {
  InstagramSocialButton,
  TiktokSocialButton,
  TwitterSocialButton,
  YoutubeSocialButton,
} from "@/components/atoms/SocialButton";
import { InstagramDetail } from "@/components/organisms/InstagramDetail";
import { TiktokDetail } from "@/components/organisms/TiktokDetail";
import { TwitterDetail } from "@/components/organisms/TwitterDetail";
import { YoutubeDetail } from "@/components/organisms/YoutubeDetail";
import { GetAccountPageQuery } from "@/graphql/generated";
import { useScrollDirection } from "@/hooks/useScrollDirection";

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

export type Props = NonNullable<GetAccountPageQuery["getAccountPage"]>;

export const Account = React.memo<Props>(
  ({ displayName, thumbnailUrl, updatedAt, youtubeChannels, twitterUsers, instagramUsers, tiktokUsers }) => {
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const [selectedTab, setSelectedTab] = React.useState<ServiceType | null>(null);

    const refs = React.useRef<HTMLDivElement[]>([]);

    const isUp = useScrollDirection();

    const youtubeChannel = youtubeChannels[0];
    const twitterUser = twitterUsers[0];
    const instagramUser = instagramUsers[0];
    const tiktokUser = tiktokUsers[0];

    const updateAtTime = React.useMemo(() => dayjs.unix(updatedAt), [updatedAt]);

    const handleSelectedTab = React.useCallback((elementId: ServiceType) => {
      const tabEle = document.getElementById("service_tab");
      const targetEle = document.getElementById(`service_tab_${elementId}`);
      tabEle?.scrollTo({ left: targetEle?.offsetLeft, behavior: "smooth" });
      setSelectedTab(elementId);
    }, []);

    const handleOnClickTab = React.useCallback(
      (elementId: ServiceType) => {
        scrollToElement(elementId);
        handleSelectedTab(elementId);
      },
      [handleSelectedTab],
    );

    React.useEffect(() => {
      // SSRの場合にdocumentを直で呼び出せないため
      const headerHeight = document.getElementById("header")?.clientHeight;
      if (headerHeight) {
        setHeaderHeight(headerHeight);
      }

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
        refs.current.forEach((ele) => {
          if (ele) {
            observer.unobserve(ele);
          }
        });
      };
    }, [handleSelectedTab]);

    return (
      <>
        <div
          css={css`
            display: flex;
          `}
        >
          <img
            src={thumbnailUrl}
            alt={displayName}
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
            <h1>{displayName}</h1>
            <div>
              {youtubeChannel && <YoutubeSocialButton channelId={youtubeChannel.id} />}
              {twitterUser && <TwitterSocialButton username={twitterUser.username} />}
              {instagramUser && <InstagramSocialButton username={instagramUser.username} />}
              {tiktokUser && <TiktokSocialButton uniqueId={tiktokUser.uniqueId} />}
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
            if (serviceName === ServiceYoutube && youtubeChannel) {
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
            if (serviceName === ServiceTwitter && twitterUser) {
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
            if (serviceName === ServiceInstagram && instagramUser) {
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
            if (serviceName === ServiceTiktok && tiktokUser) {
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

        {youtubeChannel && (
          <>
            <div
              id={ServiceYoutube}
              ref={(el) => {
                if (el) refs.current[0] = el;
              }}
            >
              <YoutubeDetail {...youtubeChannel} />
            </div>
          </>
        )}

        {twitterUser && (
          <>
            <Divider />
            <div
              id={ServiceTwitter}
              ref={(el) => {
                if (el) refs.current[1] = el;
              }}
            >
              <TwitterDetail {...twitterUser} />
            </div>
          </>
        )}

        {instagramUser && (
          <>
            <Divider />
            <div
              id={ServiceInstagram}
              ref={(el) => {
                if (el) refs.current[2] = el;
              }}
            >
              <InstagramDetail {...instagramUser} />
            </div>
          </>
        )}

        {tiktokUser && (
          <>
            <Divider />
            <div
              id={ServiceTiktok}
              ref={(el) => {
                if (el) refs.current[3] = el;
              }}
            >
              <TiktokDetail {...tiktokUser} />
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
