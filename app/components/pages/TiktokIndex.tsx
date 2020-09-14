import React from "react";
import { Button, Divider, Header, Icon } from "semantic-ui-react";
import { css } from "@emotion/core";

import { useTiktokIndexData } from "../../hooks/useTiktokIndexData";
import { TiktokCard } from "../organisms/TiktokCard";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";

export const TiktokIndex = React.memo(() => {
  const { tiktokData, hasNext, getTiktokNextPageData } = useTiktokIndexData();
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
          src="/icon_tiktok_black.svg"
          css={css`
            &&& {
              width: 42px;
              margin-right: 5px;
            }
          `}
        />
        TikTok ランキング
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
        {tiktokData.map((data, index) => {
          return <TiktokCard key={data.user.id} data={data} rankNum={index + 1} />;
        })}
      </div>

      {hasNext && (
        <Button
          fluid
          icon
          labelPosition="left"
          color="black"
          onClick={() => getTiktokNextPageData()}
          css={css`
            &&& {
              margin: 20px 0 40px 0;
            }
          `}
        >
          <Icon name="hand point right" />
          {tiktokData.length}位以降を読み込む
        </Button>
      )}

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <TwitterIndexLinkButton />
        <InstagramIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
});