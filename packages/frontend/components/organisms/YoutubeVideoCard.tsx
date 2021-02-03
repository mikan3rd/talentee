import React from "react";

import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Icon, Label } from "semantic-ui-react";

import { toUnitString } from "../../common/utils";

export const YoutubeVideoCard = React.memo<{ video: IYoutubeVideoData; rankNum: number }>(({ video, rankNum }) => {
  const {
    id,
    snippet: { title, publishedAt, tags },
    statistics: { viewCount, likeCount, dislikeCount },
  } = video;
  const publishedAtTime = dayjs(publishedAt);
  const totalCount = likeCount + dislikeCount;
  return (
    <div
      css={css`
        display: flex;
        padding: 10px 0;
        border-top: 1px dashed #22242626;
        &:first-of-type {
          border-top: none;
        }
        @media (max-width: 600px) {
          display: block;
        }
      `}
    >
      <div
        css={css`
          width: 300px;
          flex-shrink: 0;
          @media (max-width: 600px) {
            width: 100%;
          }
        `}
      >
        <div
          css={css`
            position: relative;
            width: 100%;
            padding-top: 56.25%;
          `}
        >
          <iframe
            src={`//www.youtube.com/embed/${id}`}
            frameBorder={0}
            allow="fullscreen"
            css={css`
              position: absolute;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
            `}
          />
        </div>
      </div>
      <div
        css={css`
          position: relative;
          margin-left: 10px;
          @media (max-width: 600px) {
            margin-left: 0;
            margin-top: 5px;
          }
        `}
      >
        <div
          css={css`
            position: absolute;
            bottom: 0px;
            right: 0px;
            font-weight: bold;
            font-size: 100px;
            color: lightgrey;
            line-height: 1;
          `}
        >
          {rankNum}
        </div>
        <div>{publishedAtTime.format("YYYY年M月D日")}</div>
        <div
          css={css`
            font-size: 16px;
            font-weight: bold;
            position: relative;
          `}
        >
          {title}
        </div>
        <div
          css={css`
            display: block;
          `}
        >
          <div css={CountWrapperCss}>
            <Icon name="video play" css={CountIconCss} />
            <div css={CountTextCss}>{toUnitString(viewCount)}回</div>
          </div>
          <div
            css={css`
              display: flex;
            `}
          >
            {likeCount && (
              <div css={CountWrapperCss}>
                <Icon name="thumbs up" css={CountIconCss} />
                <div css={CountTextCss}>
                  {toUnitString(likeCount)} ({Math.round((likeCount / totalCount) * 100)}%)
                </div>
              </div>
            )}
            {dislikeCount && (
              <div css={CountWrapperCss}>
                <Icon name="thumbs down" css={CountIconCss} />
                <div css={CountTextCss}>
                  {toUnitString(dislikeCount)} ({Math.round((dislikeCount / totalCount) * 100)}%)
                </div>
              </div>
            )}
          </div>
        </div>
        {tags && (
          <div>
            {tags.map((tag, index) => {
              return (
                <Label key={index} tag css={LabelCss}>
                  {tag}
                </Label>
              );
            })}
          </div>
        )}
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

const CountIconCss = css`
  &&& {
    line-height: 1;
    display: flex;
  }
`;

const CountTextCss = css``;

const LabelCss = css`
  &&& {
    margin: 5px 10px 0 12px;
  }
`;