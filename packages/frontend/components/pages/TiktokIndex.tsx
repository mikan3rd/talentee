import React from "react";

import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { Divider, Header, Pagination, PaginationProps } from "semantic-ui-react";

import { toRankingNumByPagination } from "@/common/utils";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { TiktokCard } from "@/components/organisms/TiktokCard";
import { GetTiktokRankingPageQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
} & NonNullable<GetTiktokRankingPageQuery["getTiktokRankingPage"]>;

export const TiktokIndex = React.memo<Props>(({ take, page, totalPages, tiktokUsers }) => {
  const router = useRouter();

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
      router.push({ query: { page: data.activePage } });
    },
    [router],
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
        <img
          src="/icon_tiktok_black.svg"
          alt="icon_tiktok"
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
          <span
            css={css`
              margin-left: 10px;
              font-size: 14px;
            `}
          >
            {page}ページ目
          </span>
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
        totalPages={totalPages}
        onPageChange={handlePageChange}
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
