import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Button, Divider, Icon, Image, Segment } from "semantic-ui-react";

import { useIndexData } from "../../hooks/useIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";
import { TwitterCard } from "../organisms/TwitterCard";

export const Index: React.FC = () => {
  const { youtubeData, twitterData } = useIndexData();

  return (
    <>
      {youtubeData.length > 0 && (
        <>
          <Divider />
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              @media (max-width: 600px) {
                display: block;
              }
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                @media (max-width: 600px) {
                  display: block;
                  margin-bottom: 10px;
                }
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Icon name="youtube" color="red" size="big" />
                <h2
                  css={css`
                    color: red;
                    font-size: 20px;
                    margin: 0;
                  `}
                >
                  Youtube
                </h2>
              </div>
              <span
                css={css`
                  color: black;
                  font-size: 16px;
                  font-weight: bold;
                  margin-left: 5px;
                  @media (max-width: 600px) {
                    display: block;
                  }
                `}
              >
                チャンネル登録者数ランキング
              </span>
            </div>

            <Link href="/youtube" passHref>
              <Button
                icon
                labelPosition="left"
                color="red"
                as="a"
                css={css`
                  @media (max-width: 600px) {
                    &&& {
                      width: 100%;
                    }
                  }
                `}
              >
                <Icon name="hand point right" />
                もっと詳しく！
              </Button>
            </Link>
          </div>

          <div
            css={css`
              margin: 14px 0;
            `}
          >
            {youtubeData.map((data, index) => {
              return <YoutubeCard key={data.id} data={data} rankNum={index + 1} showDetails={false} />;
            })}
          </div>

          <div
            css={css`
              text-align: right;
            `}
          >
            <Link href="/youtube" passHref>
              <Button
                icon
                labelPosition="left"
                color="red"
                as="a"
                css={css`
                  &&& {
                    width: 100%;
                  }
                `}
              >
                <Icon name="hand point right" />
                もっと詳しく！
              </Button>
            </Link>
          </div>
        </>
      )}

      {twitterData.length > 0 && (
        <>
          <Divider />
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              @media (max-width: 600px) {
                display: block;
              }
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                @media (max-width: 600px) {
                  display: block;
                  margin-bottom: 10px;
                }
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Icon name="twitter" color="blue" size="big" />
                <h2
                  css={css`
                    color: #2185d0;
                    font-size: 20px;
                    margin: 0;
                  `}
                >
                  Twitter
                </h2>
              </div>
              <span
                css={css`
                  color: black;
                  font-size: 16px;
                  font-weight: bold;
                  margin-left: 5px;
                  @media (max-width: 600px) {
                    display: block;
                  }
                `}
              >
                フォロワー数ランキング
              </span>
            </div>

            <Link href="/twitter" passHref>
              <Button
                icon
                labelPosition="left"
                color="blue"
                as="a"
                css={css`
                  @media (max-width: 600px) {
                    &&& {
                      width: 100%;
                    }
                  }
                `}
              >
                <Icon name="hand point right" />
                もっと詳しく！
              </Button>
            </Link>
          </div>

          <div
            css={css`
              margin: 14px 0;
            `}
          >
            {twitterData.map((data, index) => {
              return <TwitterCard key={data.id} data={data} rankNum={index + 1} />;
            })}
          </div>

          <div
            css={css`
              text-align: right;
            `}
          >
            <Link href="/twitter" passHref>
              <Button
                icon
                labelPosition="left"
                color="blue"
                as="a"
                css={css`
                  &&& {
                    width: 100%;
                  }
                `}
              >
                <Icon name="hand point right" />
                もっと詳しく！
              </Button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};
