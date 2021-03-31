import React from "react";

import { css } from "@emotion/react";
import { Button } from "semantic-ui-react";

export const YoutubeSocialButton = React.memo<{ className?: string; channelId?: string }>(
  ({ className, channelId }) => {
    let linkProps: IconButtonCommonProps = {
      circular: true,
    };
    if (channelId) {
      linkProps = {
        as: "a",
        href: `https://www.youtube.com/channel/${channelId}`,
        target: "_blank",
        circular: false,
      };
    }

    return <Button className={className} color="youtube" icon="youtube" {...linkProps} css={LinkButtonCss} />;
  },
);

export const TwitterSocialButton = React.memo<{ className?: string; username?: string }>(({ className, username }) => {
  let linkProps: IconButtonCommonProps = {
    circular: true,
  };
  if (username) {
    linkProps = {
      as: "a",
      href: `https://twitter.com/${username}`,
      target: "_blank",
      circular: false,
    };
  }

  return <Button className={className} color="twitter" icon="twitter" {...linkProps} css={LinkButtonCss} />;
});

export const InstagramSocialButton = React.memo<{ className?: string; username?: string }>(
  ({ className, username }) => {
    let linkProps: IconButtonCommonProps = {
      circular: true,
    };
    if (username) {
      linkProps = {
        as: "a",
        href: `https://instagram.com/${username}/`,
        target: "_blank",
        circular: false,
      };
    }

    return (
      <Button
        className={className}
        color="black"
        icon="instagram"
        {...linkProps}
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
  },
);

export const TiktokSocialButton = React.memo<{ className?: string; uniqueId?: string }>(({ className, uniqueId }) => {
  let linkProps: IconButtonCommonProps = {
    circular: true,
  };
  if (uniqueId) {
    linkProps = {
      as: "a",
      href: `https://www.tiktok.com/@${uniqueId}`,
      target: "_blank",
      circular: false,
    };
  }

  return (
    <Button className={className} color="black" {...linkProps} css={LinkButtonCss}>
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

type IconButtonCommonProps = {
  as?: string;
  href?: string;
  target?: string;
  circular: boolean;
};

const LinkButtonCss = css`
  &&& {
    margin: 0;
    padding: 11px;
    > * {
      margin: 0;
      width: 14px;
      height: 12px;
    }
  }
`;
