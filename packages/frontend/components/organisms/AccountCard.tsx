import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";

import {
  InstagramSocialButton,
  TiktokSocialButton,
  TwitterSocialButton,
  YoutubeSocialButton,
} from "@/components/atoms/SocialButton";

export const AccountCard = React.memo<{ id: string; data: AccountObjectType }>(({ id, data }) => {
  const { tmpUsername, thumbnailUrl, youtubeMainRef, twitterMainRef, instagramMainRef, tiktokMainRef } = data;
  return (
    <div
      css={css`
        position: relative;
        margin-top: 12px;
        &:first-of-type {
          margin-top: 0px;
        }
      `}
    >
      <Link href="/account/[accountId]" as={`/account/${id}`} passHref>
        <a
          target="_blank"
          css={css`
            position: relative;
            display: block;
            border-radius: 5px;
            padding: 15px;
            color: inherit;
            background-color: white;
            box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
            &:hover {
              color: inherit;
            }
          `}
        >
          <div
            css={css`
              display: flex;
            `}
          >
            <div>
              <img
                src={thumbnailUrl}
                alt={tmpUsername}
                css={css`
                  width: 64px;
                  height: 64px;
                  border-radius: 50%;
                `}
              />
            </div>
            <div
              css={css`
                margin-left: 10px;
              `}
            >
              <div
                css={css`
                  font-size: 20px;
                  font-weight: bold;
                `}
              >
                {tmpUsername}
              </div>
              <div
                css={css`
                  margin-top: 5px;
                `}
              >
                {youtubeMainRef && <YoutubeSocialButton />}
                {twitterMainRef && <TwitterSocialButton />}
                {instagramMainRef && <InstagramSocialButton />}
                {tiktokMainRef && <TiktokSocialButton />}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
});
