import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { Icon, Label } from "semantic-ui-react";

import { toUnitString } from "@/common/utils";
import { YoutubeChannel, YoutubeKeyword, YoutubeVideoCategory } from "@/graphql/generated";

const ketwordNum = 10;

interface Props
  extends Pick<
    YoutubeChannel,
    | "title"
    | "thumbnailUrl"
    | "description"
    | "subscriberCount"
    | "viewCount"
    | "videoCount"
    | "hiddenSubscriberCount"
    | "accountId"
    | "mainVideoCategoryId"
  > {
  rankNum: number;
  showDetails?: boolean;
  keywords: { keyword: Pick<YoutubeKeyword, "title"> }[];
  channelVideoCategories: { videoCategory: Pick<YoutubeVideoCategory, "id" | "title"> }[];
}

export const YoutubeCard = React.memo<Props>(
  ({
    rankNum,
    title,
    description,
    thumbnailUrl,
    subscriberCount,
    viewCount,
    videoCount,
    hiddenSubscriberCount,
    keywords,
    channelVideoCategories,
    accountId,
    mainVideoCategoryId,
    showDetails = true,
  }) => {
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
        <Link href="/account/[accountId]" as={`/account/${accountId}`} passHref>
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
                  src={thumbnailUrl}
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
                    <div css={CountTextCss}>
                      {hiddenSubscriberCount || !subscriberCount ? "非表示" : `${toUnitString(subscriberCount)}人`}
                    </div>
                  </div>
                  <div css={CountWrapperCss}>
                    <Icon name="video play" css={CountIconCss} />
                    <div css={CountTextCss}>{toUnitString(viewCount)}回</div>
                  </div>
                  <div css={CountWrapperCss}>
                    <Icon name="video" css={CountIconCss} />
                    <div css={CountTextCss}>{toUnitString(videoCount)}本</div>
                  </div>
                </div>
              </div>
            </div>

            {description && (
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
                {description}
              </p>
            )}

            {showDetails && channelVideoCategories.length > 0 && (
              <div css={LabelWrapeerCss}>
                {channelVideoCategories.map((channelVideoCategory, index) => {
                  const {
                    videoCategory: { id, title },
                  } = channelVideoCategory;
                  return (
                    <Label key={index} tag color={mainVideoCategoryId === id ? "red" : "grey"} css={LabelCss}>
                      {title}
                    </Label>
                  );
                })}
              </div>
            )}

            {showDetails && keywords.length > 0 && (
              <div css={LabelWrapeerCss}>
                {keywords.slice(0, ketwordNum - 1).map((keywordRelation, index) => {
                  return (
                    <Label key={index} tag css={LabelCss}>
                      {keywordRelation.keyword.title}
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
                    他{keywords.length - ketwordNum}件
                  </div>
                )}
              </div>
            )}
          </a>
        </Link>
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

const CountIconCss = css`
  &&& {
    line-height: 1;
    display: flex;
  }
`;

const CountTextCss = css``;

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
