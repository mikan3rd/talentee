import React from "react";
import { css } from "@emotion/core";
import { Divider, Header, Icon } from "semantic-ui-react";
import dayjs from "dayjs";

import { Linkify } from "../atoms/Linkify";
import { toUnitString } from "../../common/utils";

export const TwitterDetail: React.FC<{ twitterUserData: TwitterUserDataType; popularTweets: TweetDataType[] }> = ({
  twitterUserData,
  popularTweets,
}) => {
  const {
    name,
    username,
    profile_image_url,
    description,
    public_metrics: { followers_count, following_count, tweet_count },
    created_at,
    updatedAt,
  } = twitterUserData;

  React.useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "https://platform.twitter.com/widgets.js");
    s.setAttribute("async", "true");
    s.setAttribute("charset", "utf-8");
    document.head.appendChild(s);
  }, []);

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
            src={profile_image_url.replace(/_normal(?=.(jpg|jpeg|png)$)/, "")}
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

      {popularTweets.length > 0 && (
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
              人気ツイートTOP3
            </Header>
            <div
              css={css`
                .twitter-tweet {
                  margin: 0 auto;
                }
              `}
            >
              {popularTweets.map((tweet) => {
                const { id, text } = tweet;
                return (
                  <blockquote key={tweet.id} className="twitter-tweet">
                    <p>
                      <Linkify>{text}</Linkify>
                    </p>
                    &mdash; {name} (@{username})
                    <a href={`https://twitter.com/${username}/status/${id}`} />
                  </blockquote>
                );
              })}
            </div>
          </div>
        </>
      )}

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

{
  /* <script async src="https://platform.twitter.com/widgets.js"></script>; */
}
