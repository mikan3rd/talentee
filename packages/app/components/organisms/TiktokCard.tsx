import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";

import { toUnitString } from "../../common/utils";

export const TiktokCard = React.memo<{ data: TiktokUserObjectType; rankNum: number }>(({ data, rankNum }) => {
  const {
    accountRef,
    user: { nickname, signature, avatarMedium },
    stats: { followerCount, heartCount, videoCount },
  } = data;
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
      <Link href="/account/[accountId]" as={`/account/${accountRef.id}`} passHref>
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
              position: absolute;
              bottom: 12px;
              right: 10px;
              font-weight: bold;
              font-size: 100px;
              color: lightgrey;
              line-height: 1;
            `}
          >
            {rankNum}
          </div>
          <div
            css={css`
              display: flex;
            `}
          >
            <div>
              <img
                src={avatarMedium}
                alt={nickname}
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
                {nickname}
              </div>
              <div
                css={css`
                  display: flex;
                  margin-top: 10px;
                  @media (max-width: 600px) {
                    display: block;
                  }
                `}
              >
                <div css={CountWrapperCss}>
                  <div>{toUnitString(followerCount)} フォロワー</div>
                </div>
                <div css={CountWrapperCss}>
                  <div>{toUnitString(Number(heartCount))} いいね</div>
                </div>
                <div css={CountWrapperCss}>
                  <div>{toUnitString(videoCount)} 本</div>
                </div>
              </div>
            </div>
          </div>

          {signature && (
            <p
              css={css`
                position: relative;
                margin-top: 10px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                padding-right: 0;
                @media (max-width: 600px) {
                  -webkit-line-clamp: 4;
                }
              `}
            >
              {signature}
            </p>
          )}
        </a>
      </Link>
    </div>
  );
});

const CountWrapperCss = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-right: 15px;
  &:last-of-type {
    margin-right: 0;
  }
`;
