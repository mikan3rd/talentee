import React from "react";

import { css } from "@emotion/react";
import dayjs from "dayjs";
import { Header, Icon } from "semantic-ui-react";

import { toUnitString } from "@/common/utils";
import { Linkify } from "@/components/atoms/Linkify";
import { TwitterSocialButton } from "@/components/atoms/SocialButton";
import { Props as AccountProps } from "@/components/pages/Account";

export type Props = AccountProps["twitterUsers"][number];

export const TwitterDetail = React.memo<Props>(
  ({
    name,
    username,
    profileImageUrl,
    description,
    followersCount,
    followingCount,
    tweetCount,
    createdTimestamp,
    tweets,
  }) => {
    React.useEffect(() => {
      const s = document.createElement("script");
      s.setAttribute("src", "https://platform.twitter.com/widgets.js");
      s.setAttribute("async", "true");
      s.setAttribute("charset", "utf-8");
      document.head.appendChild(s);
    }, []);

    const createdAtTime = React.useMemo(() => dayjs.unix(createdTimestamp), [createdTimestamp]);

    return (
      <div
        css={css`
          position: relative;
        `}
      >
        <TwitterSocialButton
          username={username}
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
              src={profileImageUrl}
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
                margin-right: 45px;
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
                <div>{toUnitString(followingCount)} フォロー中</div>
              </div>
              <div css={CountWrapperCss}>
                <div>{toUnitString(followersCount)} フォロワー</div>
              </div>
              <div css={CountWrapperCss}>
                <div>{toUnitString(tweetCount)} ツイート</div>
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

        {tweets.length > 0 && (
          <div>
            <Header
              css={css`
                &&& {
                  margin: 20px 0 0 0;
                }
              `}
            >
              <Icon name="retweet" />
              人気ツイートTOP3
            </Header>
            <div
              css={css`
                .twitter-tweet {
                  margin: 0 auto;
                }
              `}
            >
              {tweets.map((tweet) => {
                const { id } = tweet;
                return (
                  <blockquote key={id} className="twitter-tweet">
                    <a href={`https://twitter.com/${username}/status/${id}`} />
                  </blockquote>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <Header
            css={css`
              &&& {
                margin: 20px 0 0 0;
              }
            `}
          >
            <Icon name="home" />
            最近のツイート
          </Header>
          <div
            css={css`
              margin: 20px 0 0 0;
              .twitter-timeline {
                border: 1px solid #ccd6dd !important;
                border-radius: 15px;
              }
            `}
          >
            <a className="twitter-timeline" data-height="500" href={`https://twitter.com/${username}`} />
          </div>
        </div>
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
