import React from "react";

import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { Divider, Header, Icon, Pagination, PaginationProps } from "semantic-ui-react";

import { toRankingNumByPagination } from "@/common/utils";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { YoutubeCard } from "@/components/organisms/YoutubeCard";
import { GetYoutubeKeywordRankingPageQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
  keywordTitle: string;
} & NonNullable<GetYoutubeKeywordRankingPageQuery["getYoutubeKeywordRankingPage"]>;

export const YoutubeKeywordIndex = React.memo<Props>(({ page, take, keywordTitle, totalPages, youtubeChannels }) => {
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
        color="red"
        css={css`
          display: flex;
          align-items: center;
          @media (max-width: 600px) {
            display: block;
          }
        `}
      >
        <div>
          <Icon name="youtube" color="red" size="big" />
          YouTubeランキング
        </div>
        <span
          css={css`
            color: black;
            font-size: 18px;
            margin-left: 10px;
            @media (max-width: 600px) {
              margin-left: 0;
            }
          `}
        >
          {keywordTitle}
        </span>
        <span
          css={css`
            color: black;
            margin-left: 10px;
            font-size: 14px;
          `}
        >
          {page}ページ目
        </span>
      </Header>

      <Divider />

      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {youtubeChannels.map((data, index) => {
          return <YoutubeCard key={data.id} {...data} rankNum={toRankingNumByPagination({ page, take, index })} />;
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
        <TwitterIndexLinkButton />
        <InstagramIndexLinkButton />
        <TiktokIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
});
