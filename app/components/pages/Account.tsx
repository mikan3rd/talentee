import React from "react";
import { css } from "@emotion/core";
import { Button, Tab } from "semantic-ui-react";

import { IYoutubeData } from "../../hooks/useIndexData";
import { IAccountData } from "../../fetchData/accountPageData";
import { YoutubeDetail } from "../organisms/YoutubeDetail";

export const Account: React.FC<{ accountData: IAccountData; youtubeData?: IYoutubeData }> = ({
  accountData,
  youtubeData,
}) => {
  const { tmpUsername, thumbnailUrl } = accountData;

  const panes = [];
  if (youtubeData) {
    panes.push({
      menuItem: { key: "youtube", icon: "youtube", content: "YouTube" },
      render: () => (
        <Tab.Pane>
          <YoutubeDetail youtubeData={youtubeData} />
        </Tab.Pane>
      ),
    });
  }

  return (
    <>
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <img
          src={thumbnailUrl}
          css={css`
            width: 120px;
            height: 120px;
            border-radius: 50%;
          `}
        />
        <div
          css={css`
            margin-left: 20px;
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
