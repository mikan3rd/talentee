import React from "react";
import { css } from "@emotion/core";
import { Divider, Icon } from "semantic-ui-react";
import dayjs from "dayjs";

import { Linkify } from "../atoms/Linkify";
import { toUnitString } from "../../common/utils";

export const TwitterDetail: React.FC<{ twitterUserData: TwitterUserDataType }> = ({ twitterUserData }) => {
  const {
    name,
    profile_image_url,
    description,
    public_metrics: { followers_count, following_count, tweet_count },
    created_at,
    updatedAt,
  } = twitterUserData;
  const createdAtTime = dayjs.unix(created_at);
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
            src={profile_image_url.replace(/_normal(?=.(jpg|png)$)/, "")}
            alt={name}
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
            {name}
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
              <div>{toUnitString(following_count)}フォロー中</div>
            </div>
            <div css={CountWrapperCss}>
              <div>{toUnitString(followers_count)}フォロワー</div>
            </div>
            <div css={CountWrapperCss}>
              <div>{toUnitString(tweet_count)}ツイート</div>
            </div>
          </div>
        </div>
      </div>

      <p
        css={css`
          margin-top: 10px;
        `}
      >
        <Linkify>{description}</Linkify>
      </p>

      <div
        css={css`
          margin-top: 10px;
          text-align: right;
        `}
      >
        開設日 {createdAtTime.format("YYYY年M月D日")}
      </div>

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
