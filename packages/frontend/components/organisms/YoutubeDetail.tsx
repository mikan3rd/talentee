import React from "react";

import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Header, Icon, Label } from "semantic-ui-react";

import { toUnitString } from "@/common/utils";
import { Linkify } from "@/components/atoms/Linkify";
import { YoutubeSocialButton } from "@/components/atoms/SocialButton";
import { YoutubeVideoCard } from "@/components/organisms/YoutubeVideoCard";
import { Props as AccountProps } from "@/components/pages/Account";

export type Props = AccountProps["youtubeChannels"][number];

export const YoutubeDetail = React.memo<Props>(
  ({
    id,
    title,
    description,
    thumbnailUrl,
    hiddenSubscriberCount,
    subscriberCount,
    viewCount,
    videoCount,
    publishedAt,
    keywords,
    channelVideoCategories,
    videos,
  }) => {
    const publishedAtTime = React.useMemo(() => dayjs(publishedAt), [publishedAt]);

    return (
      <div
        css={css`
          position: relative;
        `}
      >
        <YoutubeSocialButton
          channelId={id}
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
                margin-right: 45px;
              `}
            >
              {title}
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
                <Icon name="user plus" css={CountIconCss} />
                <div css={CountTextCss}>{hiddenSubscriberCount ? "非表示" : `${toUnitString(subscriberCount)}人`}</div>
              </div>
              <div css={CountWrapperCss}>
                <Icon name="video play" css={CountIconCss} />
                <div css={CountTextCss}>
                  {toUnitString(viewCount)}回 (平均 {toUnitString(viewCount / (videoCount | 1))}回)
                </div>
              </div>
              <div css={CountWrapperCss}>
                <Icon name="video" css={CountIconCss} />
                <div css={CountTextCss}>{toUnitString(videoCount)}本</div>
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

        {channelVideoCategories.length > 0 && (
          <div css={LabelWrapeerCss}>
            {channelVideoCategories.map(({ videoCategory }, index) => {
              return (
                <Label key={index} tag color="blue" css={LabelCss}>
                  {videoCategory.title}
                </Label>
              );
            })}
          </div>
        )}

        <div css={LabelWrapeerCss}>
          {keywords.map((keywordRelation, index) => {
            return (
              <Label key={index} tag css={LabelCss}>
                {keywordRelation.keyword.title}
              </Label>
            );
          })}
        </div>

        <div
          css={css`
            margin-top: 10px;
            text-align: right;
          `}
        >
          開設日 {publishedAtTime.format("YYYY年M月D日")}
        </div>

        {videos.length > 0 && (
          <div>
            <Header
              css={css`
                &&& {
                  margin: 20px 0 0 0;
                }
              `}
            >
              <Icon name="video play" />
              人気動画TOP3
            </Header>
            <div>
              {videos.map((video, index) => (
                <YoutubeVideoCard key={video.id} rankNum={index + 1} {...video} />
              ))}
            </div>
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
