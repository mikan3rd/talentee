import React from "react";

import { css } from "@emotion/react";
import { Divider, Header, Input } from "semantic-ui-react";

import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { AccountCard } from "@/components/organisms/AccountCard";
import { useSearchIndex } from "@/hooks/useSearchIndex";

export const SearchIndex = React.memo(() => {
  const [text, setText] = React.useState("");
  const { accountData, searchAccount } = useSearchIndex();

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

      <form>
        <Input
          fluid
          placeholder="アカウント名を入力"
          action={{
            icon: "search",
            onClick: (e) => {
              e.preventDefault();
              searchAccount(text);
            },
          }}
          value={text}
          onChange={(e, d) => setText(d.value)}
        />
      </form>

      <div
        css={css`
          margin-top: 20px;
        `}
      >
        {accountData.map(({ id, data }) => (
          <AccountCard key={id} id={id} data={data} />
        ))}
      </div>

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
