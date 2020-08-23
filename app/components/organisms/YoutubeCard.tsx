import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Icon, Label } from "semantic-ui-react";

import { IYoutubeData } from "../../hooks/useIndexData";

const ketwordNum = 10;

export const YoutubeCard: React.FC<{ data: IYoutubeData; rankNum: number; showDetails?: boolean }> = ({
  data,
  rankNum,
  showDetails = true,
}) => {
  const {
    id,
    accountRef,
    snippet: { title, thumbnails, description },
    brandingSettings: {
      channel: { keywords },
    },
    statistics: { subscriberCount, viewCount, videoCount, hiddenSubscriberCount },
    videoCategories,
  } = data;
  return (
    <div
      key={id}
      css={css`
        position: relative;
        margin-top: 12px;
        &:first-of-type {
          margin-top: 0px;
        }
      `}
    >
      <Link href={`/account/${accountRef.id}`} passHref>
        <a
          target="_blank"
          css={css`
            position: relative;
            display: block;
            border-radius: 5px;
            padding: 20px;
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

          {description && (
            <p
              css={css`
                position: relative;
                margin-top: 10px;
                white-space: pre-wrap;
                word-break: break-word;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                padding-right: ${showDetails ? "0" : "50px"};
              `}
            >
              {description}
            </p>
          )}

          {showDetails && videoCategories && (
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

          {showDetails && keywords.length > 0 && (
            <div css={LabelWrapeerCss}>
              {keywords.slice(0, ketwordNum - 1).map((keyword, index) => {
                return (
                  <Label key={index} tag css={LabelCss}>
                    {keyword}
                  </Label>
                );
              })}
              {keywords.length > ketwordNum && (
                <div
                  css={css`
                    margin-top: 5px;
                    color: #00000099;
                    font-weight: bold;
                  `}
                >
                  他{keywords.length}件
                </div>
              )}
            </div>
          )}
        </a>
      </Link>
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
  position: relative;
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
