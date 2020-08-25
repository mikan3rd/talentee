import React from "react";
import { css } from "@emotion/core";
import { Divider, Header, Icon, Label } from "semantic-ui-react";
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
              <div css={CountTextCss}>{hiddenSubscriberCount ? "非表示" : `${subscriberCount.toLocaleString()}人`}</div>
            </div>
            <div css={CountWrapperCss}>
              <Icon name="video play" css={CountIconCss} />
              <div css={CountTextCss}>
                {viewCount.toLocaleString()}回 (平均 {Math.round(viewCount / (videoCount | 1)).toLocaleString()}回)
              </div>
            </div>
            <div css={CountWrapperCss}>
              <Icon name="video" css={CountIconCss} />
              <div css={CountTextCss}>{videoCount.toLocaleString()}本</div>
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

      {youtubePopularVideos.length > 0 && (
        <>
          <Divider />
          <div>
            <Header
              css={css`
                &&& {
                  margin: 20px 0 0 0;
                }
              `}
            >
              <Icon name="video" />
              人気動画TOP3
            </Header>
            <div>
              {youtubePopularVideos.map((video) => {
                const {
                  id,
                  snippet: { title, publishedAt, tags },
                  statistics: { viewCount, likeCount, dislikeCount },
                } = video;
                const publishedAtTime = dayjs(publishedAt);
                const totalCount = likeCount + dislikeCount;
                return (
                  <div
                    key={id}
                    css={css`
                      display: flex;
                      padding: 10px 0;
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
                        margin-left: 10px;
                        @media (max-width: 600px) {
                          margin-left: 0;
                          margin-top: 5px;
                        }
                      `}
                    >
                      <div>{publishedAtTime.format("YYYY年M月D日")}</div>
                      <div
                        css={css`
                          font-size: 16px;
                          font-weight: bold;
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
                          <div css={CountTextCss}>{viewCount.toLocaleString()}回</div>
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
                                {likeCount.toLocaleString()} ({Math.round((likeCount / totalCount) * 100)}%)
                              </div>
                            </div>
                          )}
                          {dislikeCount && (
                            <div css={CountWrapperCss}>
                              <Icon name="thumbs down" css={CountIconCss} />
                              <div css={CountTextCss}>
                                {dislikeCount.toLocaleString()} ({Math.round((dislikeCount / totalCount) * 100)}%)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        {tags.map((tag, index) => {
                          return (
                            <Label key={index} tag css={LabelCss}>
                              {tag}
                            </Label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
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
    display: flex;
  }
`;

const CountTextCss = css``;

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
