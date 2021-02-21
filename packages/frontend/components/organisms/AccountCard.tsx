import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";

import { SocialButtonList } from "@/components/molecules/SocialButtonList";
import { Account, InstagramUser, TiktokUser, TwitterUser, YoutubeChannel } from "@/graphql/generated";

type Props = Pick<Account, "uuid" | "displayName" | "thumbnailUrl"> & {
  youtubeChannels: Pick<YoutubeChannel, "id">[];
  twitterUsers: Pick<TwitterUser, "username">[];
  instagramUsers: Pick<InstagramUser, "username">[];
  tiktokUsers: Pick<TiktokUser, "uniqueId">[];
};

export const AccountCard = React.memo<Props>(
  ({ uuid, displayName, thumbnailUrl, youtubeChannels, twitterUsers, instagramUsers, tiktokUsers }) => {
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
        <Link href="/account/[accountId]" as={`/account/${uuid}`} passHref>
          <a
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
                  alt={displayName}
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
                  {displayName}
                </div>
                <SocialButtonList
                  hasYoutube={youtubeChannels.length > 0}
                  hasTwitter={twitterUsers.length > 0}
                  hasInstagram={instagramUsers.length > 0}
                  hasTiktok={tiktokUsers.length > 0}
                  css={css`
                    margin-top: 5px;
                  `}
                />
              </div>
            </div>
          </a>
        </Link>
      </div>
    );
  },
);
