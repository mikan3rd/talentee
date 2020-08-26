import React from "react";
import { Button, Dropdown, Header, Icon, Segment } from "semantic-ui-react";
import { css } from "@emotion/core";

import { VideoCategorieOptions, useYoutubeIndexData } from "../../hooks/useYoutubeIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";

export const YoutubeIndex: React.FC = () => {
  const {
    selectedCategory,
    youtubeData,
    hasNext,
    getYoutubeNextPageData,
    changeSelectedCategory,
  } = useYoutubeIndexData();

  return (
    <>
      <Segment vertical>
        <Header
          as="h1"
          color="red"
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Icon name="youtube" color="red" size="big" />
          YouTube
        </Header>
      </Segment>

      <Segment vertical>
        <div
          css={css`
            display: flex;
            align-items: center;
            @media (max-width: 600px) {
              display: block;
            }
          `}
        >
          <Header
            as="h2"
            css={css`
              &&& {
                font-size: 18px;
                margin: 0 0 0 5px;
              }
            `}
          >
            チャンネル登録者数ランキング
          </Header>

          <Dropdown
            selection
            options={VideoCategorieOptions}
            value={selectedCategory}
            onChange={(e, d) => changeSelectedCategory(d.value as string)}
            css={css`
              &&& {
                margin-left: 20px;
                .menu {
                  max-height: 50vh;
                }
                @media (max-width: 600px) {
                  margin: 10px 0 0 0;
                  width: 100%;
                }
              }
            `}
          />
        </div>

        {youtubeData && (
          <div
            css={css`
              margin-top: 10px;
            `}
          >
            {youtubeData.map((data, index) => {
              return <YoutubeCard key={data.id} data={data} rankNum={index + 1} />;
            })}
          </div>
        )}

        {hasNext && (
          <Button
            fluid
            icon
            labelPosition="left"
            color="red"
            onClick={() => getYoutubeNextPageData()}
            css={css`
              &&& {
                margin-top: 20px;
              }
            `}
          >
            <Icon name="hand point right" />
            {youtubeData.length}位以降を読み込む
          </Button>
        )}
      </Segment>
    </>
  );
};
