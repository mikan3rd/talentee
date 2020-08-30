import React from "react";
import { css } from "@emotion/core";
import { Button, Icon } from "semantic-ui-react";
import Link from "next/link";

export const YoutubeIndexLinkButton: React.FC = () => {
  return (
    <Link href="/youtube" passHref>
      <Button icon labelPosition="left" color="red" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        他のYouTuberを見つける！
      </Button>
    </Link>
  );
};

export const TwitterIndexLinkButton: React.FC = () => {
  return (
    <Link href="/twitter" passHref>
      <Button icon labelPosition="left" color="blue" as="a" css={WideButtonCss}>
        <Icon name="hand point right" />
        他のTwitterを見つける！
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