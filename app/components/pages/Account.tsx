import React from "react";
import { css } from "@emotion/core";
import { Button, Tab } from "semantic-ui-react";

import { YoutubeDetail } from "../organisms/YoutubeDetail";

export const Account: React.FC<{
  accountData: IAccountData;
  youtubeData?: IYoutubeData;
  youtubePopularVideos: IYoutubeVideoData[];
}> = ({ accountData, youtubeData, youtubePopularVideos }) => {
  const { tmpUsername, thumbnailUrl } = accountData;

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
              />
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
    </>
  );
};
