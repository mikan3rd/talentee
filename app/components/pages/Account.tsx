import React from "react";
import { css } from "@emotion/core";
import { Button, Divider, Tab } from "semantic-ui-react";

import { YoutubeDetail } from "../organisms/YoutubeDetail";
import { TwitterDetail } from "../organisms/TwitterDetail";
import { TwitterIndexLinkButton, YoutubeIndexLinkButton } from "../atoms/IndexLinkButton";

export const Account: React.FC<{
  accountData: IAccountData;
  youtubeData?: IYoutubeData;
  youtubePopularVideos: IYoutubeVideoData[];
  twitterUserData: TwitterUserDataType;
  popularTweets: TweetDataType[];
  tiktokUserData: TiktokUserDataType;
}> = ({ accountData, youtubeData, youtubePopularVideos, twitterUserData, popularTweets, tiktokUserData }) => {
  const { tmpUsername } = accountData;

  // TODO: 元のデータを修正する
  const thumbnailUrl = accountData.thumbnailUrl.replace(/_normal(?=.(jpg|jpeg|png)$)/, "");

  const panes = [];
  if (youtubeData) {
    panes.push({
      menuItem: { key: "youtube", icon: "youtube", content: "YouTube" },
      render: () => (
        <Tab.Pane>
          <YoutubeDetail youtubeData={youtubeData} youtubePopularVideos={youtubePopularVideos} />
        </Tab.Pane>
      ),
    });
  }

  if (twitterUserData) {
    panes.push({
      menuItem: { key: "twitter", icon: "twitter", content: "Twitter" },
      render: () => (
        <Tab.Pane>
          <TwitterDetail twitterUserData={twitterUserData} popularTweets={popularTweets} />
        </Tab.Pane>
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

      <div
        css={css`
          margin-top: 20px;
        `}
      >
        <Tab panes={panes} />
      </div>

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <TwitterIndexLinkButton />
      </div>
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
