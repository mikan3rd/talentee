import React from "react";
import { css } from "@emotion/core";
import { Divider, Icon } from "semantic-ui-react";
import dayjs from "dayjs";

import { Linkify } from "../atoms/Linkify";
import { toUnitString } from "../../common/utils";

export const TiktokDetail: React.FC<{ tiktokUserData: TiktokUserDataType }> = ({ tiktokUserData }) => {
  const {
    user: { nickname, signature, avatarMedium },
    stats: { followerCount, followingCount, heartCount, videoCount },
    updatedAt,
  } = tiktokUserData;

  const updateAtTime = dayjs.unix(updatedAt);
  return (
    <div>
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

      <Divider />

      <div
        css={css`
          text-align: right;
        `}
      >
        <Icon name="history" /> {updateAtTime.format("YYYY年M月D日")}
      </div>
    </div>
  );
};

const CountWrapperCss = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-right: 15px;
  &:last-of-type {
    margin-right: 0;
  }
`;
