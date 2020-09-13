import React from "react";
import { Button, Divider, Header, Icon } from "semantic-ui-react";
import { css } from "@emotion/core";

import { useTwitterIndexData } from "../../hooks/useTwitterIndexData";
import { TwitterCard } from "../organisms/TwitterCard";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";

export const TwitterIndex: React.FC = () => {
  const { twitterData, hasNext, getTwitterNextPageData } = useTwitterIndexData();
  return (
    <>
      <Header
        as="h1"
        color="blue"
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Icon name="twitter" color="blue" size="big" />
        Twitter ランキング
      </Header>

      <Divider />

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
          フォロワー数ランキング
        </Header>
      </div>

      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {twitterData.map((data, index) => {
          return <TwitterCard key={data.id} data={data} rankNum={index + 1} />;
        })}
      </div>

      {hasNext && (
        <Button
          fluid
          icon
          labelPosition="left"
          color="twitter"
          onClick={() => getTwitterNextPageData()}
          css={css`
            &&& {
              margin: 20px 0 40px 0;
            }
          `}
        >
          <Icon name="hand point right" />
          {twitterData.length}位以降を読み込む
        </Button>
      )}

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <InstagramIndexLinkButton />
        <TiktokIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
};
