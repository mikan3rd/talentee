import React from "react";
import { css } from "@emotion/core";
import { Button, Divider, Icon, Menu, Tab } from "semantic-ui-react";

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

export enum ElementIds {
  Youtube = "youtube",
  Twitter = "twitter",
  Instagram = "instagram",
  Tiktok = "tiktok",
}

const scrollToElement = (elementId: ElementIds) => {
  const header = document.getElementById("header");
  const target = document.getElementById(elementId);
  if (header && target) {
    window.scrollTo({ top: target.offsetTop - header.clientHeight, behavior: "smooth" });
  }
};

export const Account: React.FC<{
  accountData: IAccountData;
  youtubeData?: IYoutubeData;
  youtubePopularVideos: IYoutubeVideoData[];
  twitterUserData?: TwitterUserDataType;
  popularTweets: TweetDataType[];
  instagramUserData?: InstagramUserDataType;
  tiktokUserData?: TiktokUserDataType;
}> = ({
  accountData,
  youtubeData,
  youtubePopularVideos,
  twitterUserData,
  popularTweets,
  instagramUserData,
  tiktokUserData,
}) => {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  React.useEffect(() => {
    const headerHeight = document.getElementById("header").clientHeight;
    console.log("!!!", headerHeight);
    setHeaderHeight(headerHeight);
  }, []);

  console.log(headerHeight);

  const isUp = useScrollDirection();

  const { tmpUsername, thumbnailUrl } = accountData;

  const panes = [];

  if (youtubeData) {
    panes.push({
      menuItem: (
        <Menu.Item key="youtube" onClick={() => scrollToElement(ElementIds.Youtube)}>
          <Icon
            name="youtube"
            css={css`
              color: red;
            `}
          />
          YouTube
        </Menu.Item>
      ),
    });
  }

  if (twitterUserData) {
    panes.push({
      menuItem: (
        <Menu.Item key="twitter" onClick={() => scrollToElement(ElementIds.Twitter)}>
          <Icon
            name="twitter"
            css={css`
              color: #55acee;
            `}
          />
          Twitter
        </Menu.Item>
      ),
    });
  }

  if (instagramUserData) {
    panes.push({
      menuItem: (
        <Menu.Item key="instagram" onClick={() => scrollToElement(ElementIds.Instagram)}>
          <img src="/icon_instagram.svg" css={TabIconCss} />
          Instagram
        </Menu.Item>
      ),
    });
  }

  if (tiktokUserData) {
    panes.push({
      menuItem: (
        <Menu.Item key="tiktok" onClick={() => scrollToElement(ElementIds.Tiktok)}>
          <img src="/icon_tiktok_black.svg" css={TabIconCss} />
          TikTok
        </Menu.Item>
      ),
    });
  }

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
                  css={css`
                    width: 100%;
                  `}
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tab
        panes={panes}
        menu={{ secondary: true, pointing: true }}
        css={css`
          &&& {
            position: sticky;
            top: ${isUp ? `${headerHeight}px` : 0};
            z-index: 1;
            margin-top: 20px;
            background-color: #f7f7f7;
            transition: all 0.5s ease;
            .menu {
              overflow-x: scroll;
              padding-bottom: 2px;
            }
            .item {
              transition: all 0.5s ease !important;
            }
          }
        `}
      />

      {youtubeData && (
        <>
          <Divider />
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
          <InstagramDetail instagramUserData={instagramUserData} />
        </>
      )}

      {tiktokUserData && (
        <>
          <Divider />
          <TiktokDetail tiktokUserData={tiktokUserData} />
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
};

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
