import React from "react";

import { css } from "@emotion/react";
import { Divider, Header, Pagination, PaginationProps } from "semantic-ui-react";

import { toRankingNumByPagination } from "@/common/utils";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { TiktokCard } from "@/components/organisms/TiktokCard";
import { useGetTiktokRankingPageQuery } from "@/graphql/generated";

const take = 10;

export const TiktokIndex = React.memo(() => {
  const [page, setPage] = React.useState(1);

  const { data, refetch } = useGetTiktokRankingPageQuery({ variables: { pagination: { take, page } } });

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
      const page = Number(data.activePage);
      refetch({ pagination: { page, take } });
      setPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [refetch],
  );

  if (!data) {
    return null;
  }

  const {
    getTiktokRankingPage: { totalPages, tiktokUsers },
  } = data;

  return (
    <>
      <Header
        as="h1"
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <img
          src="/icon_tiktok_black.svg"
          css={css`
            &&& {
              width: 42px;
              margin-right: 5px;
            }
          `}
        />
        TikTokランキング
      </Header>

      <Divider />

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

      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {tiktokUsers.map((data, index) => {
          return <TiktokCard key={data.uniqueId} {...data} rankNum={toRankingNumByPagination({ page, take, index })} />;
        })}
      </div>

      <div
        css={css`
          margin: 10px auto 0 auto;
        `}
      >
        <Pagination activePage={page} totalPages={totalPages} onPageChange={handlePageChange} />
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
