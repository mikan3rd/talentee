import React from "react";

import { css } from "@emotion/react";
import { Divider, Header, Input, Pagination, PaginationProps } from "semantic-ui-react";

import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { AccountCard } from "@/components/organisms/AccountCard";
import { useSearchAccountLazyQuery } from "@/graphql/generated";

const take = 10;

export const SearchIndex = React.memo(() => {
  const [text, setText] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [fetch, { data }] = useSearchAccountLazyQuery();

  const handleSearch = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      fetch({ variables: { pagination: { word: text, take, page } } });
    },
    [page, fetch, text],
  );

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
      const page = Number(data.activePage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetch({ variables: { pagination: { word: text, take, page } } });
      setPage(page);
    },
    [fetch, text],
  );

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
            disabled: !text,
            onClick: handleSearch,
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
        {data?.searchAccount.accounts.map((data) => (
          <AccountCard key={data.uuid} {...data} />
        ))}
      </div>

      {data?.searchAccount.accounts.length > 0 && (
        <Pagination
          css={css`
            &&& {
              width: 100%;
              margin-top: 10px;
              overflow-x: auto;
              > a {
                flex-grow: 1;
                display: flex;
                justify-content: center;
              }
            }
          `}
          activePage={page}
          totalPages={data?.searchAccount.totalPages}
          onPageChange={handlePageChange}
        />
      )}

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
