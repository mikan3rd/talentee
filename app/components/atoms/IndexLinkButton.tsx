import React from "react";
import { css } from "@emotion/core";
import { Button, Icon } from "semantic-ui-react";
import Link from "next/link";

export const IndexLinkButton: React.FC = () => {
  return (
    <Link href="/" passHref>
      <Button icon labelPosition="left" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Topに戻る
      </Button>
    </Link>
  );
};

export const YoutubeIndexLinkButton: React.FC = () => {
  return (
    <Link href="/youtube" passHref>
      <Button icon labelPosition="left" color="youtube" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Youtuberの一覧を見る
      </Button>
    </Link>
  );
};

export const TwitterIndexLinkButton: React.FC = () => {
  return (
    <Link href="/twitter" passHref>
      <Button icon labelPosition="left" color="twitter" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Twitterの一覧を見る
      </Button>
    </Link>
  );
};

export const InstagramIndexLinkButton: React.FC = () => {
  return (
    <Link href="/instagram" passHref>
      <Button icon labelPosition="left" color="instagram" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        Instagramerの一覧を見る
      </Button>
    </Link>
  );
};

const WideButtonCss = css`
  &&& {
    width: 100%;
    margin-top: 10px;
    &:first-of-type {
      margin-top: 0;
    }
  }
`;
