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

      <Segment
        vertical
        css={css`
          &&& {
            padding-bottom: 60px;
          }
        `}
      >
        <Header
          css={css`
            &&& {
              color: red;
              margin-bottom: 0;
            }
          `}
        >
          <Icon name="youtube" />
          <Header.Content as="h2">
            Youtube{" "}
            <span
              css={css`
                color: black;
                font-size: 16px;
                margin-left: 5px;
              `}
            >
              チャンネル登録者数ランキング
            </span>
          </Header.Content>
        </Header>

        <Link href="/youtube" passHref>
          <Button
            icon
            labelPosition="left"
            color="red"
            as="a"
            css={css`
              &&&& {
                position: absolute;
                top: 10px;
                right: 0;
              }
            `}
          >
            <Icon name="hand point right" />
            もっと詳しく！
          </Button>
        </Link>

        <div
          css={css`
            margin-top: 14px;
          `}
        >
          {youtubeData &&
            youtubeData.map((data) => {
              return <YoutubeCard key={data.id} data={data} />;
            })}
        </div>

        <Link href="/youtube" passHref>
          <Button
            icon
            labelPosition="left"
            color="red"
            as="a"
            css={css`
              &&&& {
                position: absolute;
                bottom: 10px;
                right: 0;
              }
            `}
          >
            <Icon name="hand point right" />
            もっと詳しく！
          </Button>
        </Link>
      </Segment>

      <Segment vertical></Segment>
    </>
  );
};
