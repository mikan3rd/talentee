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
  YoutubeVideoTagLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { YoutubeCard } from "@/components/organisms/YoutubeCard";
import { GetYoutubeVideoTagRankingPageQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
  getYoutubeKeywordRankingPage: NonNullable<GetYoutubeVideoTagRankingPageQuery["getYoutubeVideoTagRankingPage"]>;
};

export const YoutubeVideoTagRankingIndex = React.memo<Props>(({ page, take, getYoutubeKeywordRankingPage }) => {
  const router = useRouter();

  const { youtubeChannels, totalPages, youtubeTag } = getYoutubeKeywordRankingPage;

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
      router.push({
        pathname: "/youtube/videoTag/[tagId]/page/[page]",
        query: { tagId: youtubeTag?.id, page: data.activePage },
      });
    },
    [youtubeTag, router],
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
          {youtubeTag?.title}
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

      <p>「{youtubeTag?.title}」の動画で人気のおすすめYoutubeチャンネル一覧</p>

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

      <div
        css={css`
          margin-top: 15px;
        `}
      >
        <YoutubeKeywordLinkButton />
        <YoutubeVideoTagLinkButton />
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
});
