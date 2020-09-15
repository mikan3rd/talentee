import React from "react";
import { css } from "@emotion/core";
import { Icon } from "semantic-ui-react";
import dayjs from "dayjs";

import { Linkify } from "../atoms/Linkify";
import { toUnitString } from "../../common/utils";
import { ElementIds } from "../pages/Account";

export const InstagramDetail = React.memo<{
  instagramUserData: InstagramUserDataType;
  instagramPopularMedia: InstagramMediaType[];
}>(({ instagramUserData, instagramPopularMedia }) => {
  const {
    full_name,
    biography,
    external_url,
    profile_pic_url,
    edge_followed_by,
    edge_follow,
    edge_owner_to_timeline_media,
    updatedAt,
  } = instagramUserData;

  const updateAtTime = dayjs.unix(updatedAt);
  return (
    <div id={ElementIds.Instagram}>
      <div
        css={css`
          display: flex;
        `}
      >
        <div>
          <img
            src={profile_pic_url}
            alt={full_name}
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
            {full_name}
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
              <div>フォロー中 {toUnitString(edge_follow.count)}人</div>
            </div>
            <div css={CountWrapperCss}>
              <div>フォロワー {toUnitString(edge_followed_by.count)}人</div>
            </div>
            {edge_owner_to_timeline_media && (
              <div css={CountWrapperCss}>
                <div>投稿 {toUnitString(edge_owner_to_timeline_media.count)}件</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p
        css={css`
          margin-top: 10px;
        `}
      >
        <Linkify>
          {biography}
          {external_url && (
            <>
              <br />
              {external_url}
            </>
          )}
        </Linkify>
      </p>

      <div
        css={css`
          text-align: right;
        `}
      >
        <Icon name="history" /> {updateAtTime.format("YYYY年M月D日")}
      </div>
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
