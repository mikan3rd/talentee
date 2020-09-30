import React from "react";

import { css } from "@emotion/core";
import { Divider, Header, Icon, Input } from "semantic-ui-react";

import { useSearchIndex } from "../../hooks/useSearchIndex";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "../atoms/IndexLinkButton";

export const SearchIndex = React.memo(() => {
  const [text, setText] = React.useState("");
  const { searchAccount } = useSearchIndex();

  return (
    <>
      <Header
        as="h1"
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        アカウント検索
      </Header>

      <Divider />

      <Input
        fluid
        placeholder="アカウント名を入力"
        action={{ icon: "search", onClick: () => searchAccount(text) }}
        value={text}
        onChange={(e, d) => setText(d.value)}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     searchAccount(text);
        //   }
        // }}
      />

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <TwitterIndexLinkButton />
        <InstagramIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
});
