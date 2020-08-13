import React from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { css } from "@emotion/core";

import { useYoutubeIndexData } from "../../hooks/useYoutubeIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";

export const YoutubeIndex: React.FC = () => {
  const { youtubeData, hasNext, getYoutubePageData } = useYoutubeIndexData();

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

      {youtubeData && (
        <Segment vertical>
          <Header
            as="h2"
            css={css`
              &&& {
                font-size: 18px;
                margin: 0 0 0 5px;
              }
            `}
          >
            <Icon name="user plus" />
            チャンネル登録者数ランキング
          </Header>

          <div
            css={css`
              margin-top: 10px;
            `}
          >
            {youtubeData.map((data, index) => {
              return <YoutubeCard key={data.id} data={data} rankNum={index + 1} />;
            })}
          </div>

          <Button
            fluid
            icon
            labelPosition="left"
            color="red"
            disabled={!hasNext}
            onClick={() => getYoutubePageData()}
            css={css`
              &&& {
                margin-top: 20px;
              }
            `}
          >
            <Icon name="hand point right" />
            さらに読み込む
          </Button>
        </Segment>
      )}

      <Segment vertical></Segment>
    </>
  );
};
