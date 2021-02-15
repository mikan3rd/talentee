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
  YoutubeKeywordLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { YoutubeCard } from "@/components/organisms/YoutubeCard";
import { GetYoutubeKeywordRankingPageQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
  keywordTitle: string;
  getYoutubeKeywordRankingPage: GetYoutubeKeywordRankingPageQuery["getYoutubeKeywordRankingPage"];
};

export const YoutubeKeywordRankingIndex = React.memo<Props>(
  ({ page, take, keywordTitle, getYoutubeKeywordRankingPage }) => {
    const router = useRouter();

    const handlePageChange = React.useCallback(
      async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
        router.push({
          pathname: "/youtube/keyword/[keywordTitle]/page/[page]",
          query: { keywordTitle, page: data.activePage },
        });
      },
      [keywordTitle, router],
    );

    const { youtubeChannels, totalPages } = getYoutubeKeywordRankingPage;

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
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
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
            return (
              <YoutubeCard
                key={data.id}
                {...data}
                rankNum={toRankingNumByPagination({ page, take, index })}
                activeKeywordTitle={keywordTitle}
              />
            );
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

        <div
          css={css`
            margin-top: 15px;
          `}
        >
          <YoutubeKeywordLinkButton />
        </div>

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
  },
);
