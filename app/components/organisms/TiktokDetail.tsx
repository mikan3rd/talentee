import React from "react";

import { css } from "@emotion/core";
import { Header, Icon } from "semantic-ui-react";

import { toUnitString } from "../../common/utils";
import { Linkify } from "../atoms/Linkify";
import { TiktokSocialButton } from "../atoms/SocialButton";

export const TiktokDetail = React.memo<{ tiktokUserData: TiktokUserDataType; tiktokPopularItem: TiktokItemType[] }>(
  ({ tiktokUserData, tiktokPopularItem }) => {
    React.useEffect(() => {
      const s = document.createElement("script");
      s.setAttribute("src", "https://www.tiktok.com/embed.js");
      s.setAttribute("async", "true");
      document.head.appendChild(s);
    }, []);

    const {
      user: { uniqueId, nickname, signature, avatarMedium },
      stats: { followerCount, followingCount, heartCount, videoCount },
    } = tiktokUserData;

    return (
      <div
        css={css`
          position: relative;
        `}
      >
        <TiktokSocialButton
          uniqueId={uniqueId}
          css={css`
            position: absolute;
            right: 0px;
            top: 0px;
          `}
        />
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
                margin-right: 45px;
              `}
            >
              {nickname}
            </div>
            <div
              css={css`
                display: flex;
                @media (max-width: 600px) {
                  display: block;
                }
              `}
            >
              <div css={CountWrapperCss}>
                <div>{toUnitString(followingCount)} フォロー中</div>
              </div>
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

        <p
          css={css`
            margin-top: 10px;
          `}
        >
          <Linkify>{signature}</Linkify>
        </p>

        {tiktokPopularItem.length > 0 && (
          <div>
            <Header
              css={css`
                &&& {
                  margin: 20px 0 0 0;
                }
              `}
            >
              <Icon name="heart" />
              人気の動画TOP3
            </Header>
            {tiktokPopularItem.map((item) => {
              const { id } = item;
              return (
                <blockquote
                  key={id}
                  className="tiktok-embed"
                  cite={`https://www.tiktok.com/@${uniqueId}/video/${item}`}
                  data-video-id={id}
                  css={css`
                    max-width: 605px;
                    min-width: 325px;
                  `}
                >
                  <section />
                </blockquote>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

const CountWrapperCss = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-right: 15px;
  &:last-of-type {
    margin-right: 0;
  }
`;
