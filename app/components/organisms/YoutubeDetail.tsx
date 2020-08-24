import React from "react";
import { css } from "@emotion/core";
import { Icon, Label } from "semantic-ui-react";
import dayjs from "dayjs";

import { IYoutubeData } from "../../hooks/useIndexData";
import { IYoutubeVideoData } from "../../fetchData/accountPageData";
import { Linkify } from "../atoms/Linkify";

export const YoutubeDetail: React.FC<{ youtubeData: IYoutubeData; youtubePopularVideos: IYoutubeVideoData[] }> = ({
  youtubeData,
  youtubePopularVideos,
}) => {
  const {
    snippet: { title, thumbnails, description },
    brandingSettings: {
      channel: { keywords },
    },
    statistics: { subscriberCount, viewCount, videoCount, hiddenSubscriberCount },
    updatedAt,
    videoCategories,
  } = youtubeData;

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
            src={thumbnails.medium.url}
            alt={title}
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
            {title}
          </div>
          <div>
            <Icon name="sync" /> {updateAtTime.format("YYYY年M月D日")}
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
              <Icon name="user plus" css={CountIconCss} />
              <div css={CountTextCss}>{hiddenSubscriberCount ? "非表示" : subscriberCount.toLocaleString()}</div>
            </div>
            <div css={CountWrapperCss}>
              <Icon name="video play" css={CountIconCss} />
              <div css={CountTextCss}>{viewCount.toLocaleString()}</div>
            </div>
            <div css={CountWrapperCss}>
              <Icon name="video" css={CountIconCss} />
              <div css={CountTextCss}>{videoCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      <p
        css={css`
          margin-top: 10px;
          white-space: pre-wrap;
          word-break: break-word;
        `}
      >
        <Linkify>{description}</Linkify>
      </p>

      {videoCategories && (
        <div css={LabelWrapeerCss}>
          {videoCategories.map((category, index) => {
            const {
              snippet: { title },
            } = category;
            return (
              <Label key={index} tag color="blue" css={LabelCss}>
                {title}
              </Label>
            );
          })}
        </div>
      )}

      <div css={LabelWrapeerCss}>
        {keywords.map((keyword, index) => {
          return (
            <Label key={index} tag css={LabelCss}>
              {keyword}
            </Label>
          );
        })}
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

const CountIconCss = css`
  &&& {
    line-height: 1;
    width: 20px;
    display: flex;
  }
`;

const CountTextCss = css`
  margin-left: 2px;
`;

const LabelWrapeerCss = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px;
`;

const LabelCss = css`
  &&& {
    margin: 5px 10px 0 12px;
  }
`;
