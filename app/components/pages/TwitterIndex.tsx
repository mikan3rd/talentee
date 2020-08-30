import React from "react";
import { Button, Dropdown, Header, Icon, Segment } from "semantic-ui-react";
import { css } from "@emotion/core";

export const TwitterIndex: React.FC = () => {
  return (
    <>
      <Segment vertical>
        <Header
          as="h1"
          color="red"
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Icon name="twitter" color="red" size="big" />
          Twitter
        </Header>
      </Segment>

      <Segment vertical>
        <div
          css={css`
            display: flex;
            align-items: center;
            @media (max-width: 600px) {
              display: block;
            }
          `}
        >
          <Header
            as="h2"
            css={css`
              &&& {
                font-size: 18px;
                margin: 0 0 0 5px;
              }
            `}
          >
            フォロワー数ランキング
          </Header>
        </div>
      </Segment>
    </>
  );
};
