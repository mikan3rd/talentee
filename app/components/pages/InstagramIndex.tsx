import React from "react";
import { Button, Divider, Header, Icon } from "semantic-ui-react";
import { css } from "@emotion/core";

import { useInstagramIndexData } from "../../hooks/useInstagramIndexData";
import { InstagramCard } from "../organisms/InstagramCard";
import {
  IndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";

export const InstagramIndex: React.FC = () => {
  const { instagramData, hasNext, getInstagramNextPageData } = useInstagramIndexData();
  return (
    <>
      <Header
        as="h1"
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <img
          src="/icon_instagram.svg"
          css={css`
            &&& {
              width: 42px;
              margin-right: 5px;
            }
          `}
        />
        Instagram ランキング
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
        {instagramData.map((data, index) => {
          return <InstagramCard key={data.id} data={data} rankNum={index + 1} />;
        })}
      </div>

      {hasNext && (
        <Button
          fluid
          icon
          labelPosition="left"
          color="instagram"
          onClick={() => getInstagramNextPageData()}
          css={css`
            &&& {
              margin: 20px 0 40px 0;
            }
          `}
        >
          <Icon name="hand point right" />
          {instagramData.length}位以降を読み込む
        </Button>
      )}

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <TwitterIndexLinkButton />
        <TiktokIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
};
