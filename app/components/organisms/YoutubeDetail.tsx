import React from "react";
import { css } from "@emotion/core";
import { Icon, Label } from "semantic-ui-react";

import { IYoutubeData } from "../../hooks/useIndexData";

export const YoutubeDetail: React.FC<{ youtubeData: IYoutubeData }> = ({ youtubeData }) => {
  const {
    snippet: { title, thumbnails, description },
    brandingSettings: {
      channel: { keywords },
    },
    statistics: { subscriberCount, viewCount, videoCount },
  } = youtubeData;
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
              width: 80px;
              height: 80px;
              border-radius: 50%;
            `}
          />
        </div>
        <div
          css={css`
            margin-left: 20px;
            padding-right: 40px;
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
          <div
            css={css`
              display: flex;
              margin-top: 10px;
            `}
          >
            <div css={CountWrapperCss}>
              <Icon name="user plus" css={CountIconCss} />
              <div css={CountTextCss}>{subscriberCount.toLocaleString()}</div>
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
        {description}
      </p>
      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {keywords.map((keyword, index) => {
          return (
            <Label
              key={index}
              tag
              css={css`
                &&& {
                  margin-top: 5px;
                }
              `}
            >
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
