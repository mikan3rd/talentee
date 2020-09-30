import React from "react";

import { css } from "@emotion/core";
import { Button } from "semantic-ui-react";

export const YoutubeSocialButton = React.memo<{ className?: string; channelId: string }>(({ className, channelId }) => {
  return (
    <Button
      className={className}
      circular
      color="youtube"
      icon="youtube"
      as="a"
      href={`https://www.youtube.com/channel/${channelId}`}
      target="_black"
      css={LinkButtonCss}
    />
  );
});

export const TwitterSocialButton = React.memo<{ className?: string; username: string }>(({ className, username }) => {
  return (
    <Button
      className={className}
      circular
      color="twitter"
      icon="twitter"
      as="a"
      href={`https://twitter.com/${username}`}
      target="_black"
      css={LinkButtonCss}
    />
  );
});

export const InstagramSocialButton = React.memo<{ className?: string; username: string }>(({ className, username }) => {
  return (
    <Button
      className={className}
      circular
      color="black"
      icon="instagram"
      as="a"
      href={`https://instagram.com/${username}/`}
      target="_black"
      css={css`
        ${LinkButtonCss}
        &&& {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
        }
      `}
    />
  );
});

export const TiktokSocialButton = React.memo<{ className?: string; uniqueId: string }>(({ className, uniqueId }) => {
  return (
    <Button
      className={className}
      circular
      color="black"
      as="a"
      href={`https://www.tiktok.com/@${uniqueId}`}
      target="_black"
      css={LinkButtonCss}
    >
      <img
        src="/icon_tiktok.svg"
        alt="icon_tiktok"
        css={css`
          width: 100%;
        `}
      />
    </Button>
  );
});

const LinkButtonCss = css`
  &&& {
    margin: 0 0 0 10px;
    padding: 11px;
    &:first-of-type {
      margin-left: 0;
    }
    > * {
      width: 14px;
      height: 12px;
    }
  }
`;
