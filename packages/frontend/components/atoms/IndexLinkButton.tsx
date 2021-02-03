import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { Button, Icon } from "semantic-ui-react";

export const IndexLinkButton = React.memo(() => {
  return (
    <Link href="/" passHref>
      <Button icon labelPosition="left" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Topに戻る
      </Button>
    </Link>
  );
});

export const YoutubeIndexLinkButton = React.memo(() => {
  return (
    <Link href="/youtube/all" passHref>
      <Button icon labelPosition="left" color="youtube" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Youtubeのランキングを見る
      </Button>
    </Link>
  );
});

export const TwitterIndexLinkButton = React.memo(() => {
  return (
    <Link href="/twitter" passHref>
      <Button icon labelPosition="left" color="twitter" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Twitterのランキングを見る
      </Button>
    </Link>
  );
});

export const InstagramIndexLinkButton = React.memo(() => {
  return (
    <Link href="/instagram" passHref>
      <Button icon labelPosition="left" color="instagram" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Instagramのランキングを見る
      </Button>
    </Link>
  );
});

export const TiktokIndexLinkButton = React.memo(() => {
  return (
    <Link href="/tiktok" passHref>
      <Button icon labelPosition="left" color="black" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        TikTokのランキングを見る
      </Button>
    </Link>
  );
});

const WideButtonCss = css`
  &&& {
    width: 100%;
    margin-top: 10px;
    &:first-of-type {
      margin-top: 0;
    }
  }
`;
