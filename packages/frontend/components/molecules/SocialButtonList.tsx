import React from "react";

import { css } from "@emotion/react";

import {
  InstagramSocialButton,
  TiktokSocialButton,
  TwitterSocialButton,
  YoutubeSocialButton,
} from "@/components/atoms/SocialButton";

export const SocialButtonList = React.memo<{
  className?: string;
  hasYoutube?: boolean;
  hasTwitter?: boolean;
  hasInstagram?: boolean;
  hasTiktok?: boolean;
  youtubeChannelId?: string;
  twitterUsername?: string;
  instagramUsername?: string;
  tiktokUniqueId?: string;
}>(
  ({
    className,
    hasYoutube,
    hasTwitter,
    hasInstagram,
    hasTiktok,
    youtubeChannelId,
    twitterUsername,
    instagramUsername,
    tiktokUniqueId,
  }) => {
    return (
      <div className={className}>
        {(hasYoutube || youtubeChannelId) && (
          <YoutubeSocialButton
            channelId={youtubeChannelId}
            css={css`
              ${CommonCss}
            `}
          />
        )}
        {(hasTwitter || twitterUsername) && (
          <TwitterSocialButton
            username={twitterUsername}
            css={css`
              ${CommonCss}
            `}
          />
        )}
        {(hasInstagram || instagramUsername) && (
          <InstagramSocialButton
            username={instagramUsername}
            css={css`
              ${CommonCss}
            `}
          />
        )}
        {(hasTiktok || tiktokUniqueId) && (
          <TiktokSocialButton
            uniqueId={tiktokUniqueId}
            css={css`
              ${CommonCss}
            `}
          />
        )}
      </div>
    );
  },
);

const CommonCss = css`
  &&& {
    margin-left: 10px;
    &:first-of-type {
      margin-left: 0;
    }
  }
`;
