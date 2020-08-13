import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

import { useIndexData } from "../../hooks/useIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";

export const Index: React.FC = () => {
  const { youtubeData } = useIndexData();

  return (
    <>
      <Segment vertical></Segment>

      <Segment vertical>
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
          {youtubeData &&
            youtubeData.map((data) => {
              return <YoutubeCard key={data.id} data={data} />;
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
      </Segment>

      <Segment vertical></Segment>
    </>
  );
};
