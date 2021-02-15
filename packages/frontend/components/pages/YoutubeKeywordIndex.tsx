import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Divider, Header, Icon, Label, Pagination, PaginationProps } from "semantic-ui-react";

import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { GetYoutubeKeywordIndexPageQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
  getYoutubeKeywordIndexPage: GetYoutubeKeywordIndexPageQuery["getYoutubeKeywordIndexPage"];
};

export const YoutubeKeywordIndex = React.memo<Props>(({ page, take, getYoutubeKeywordIndexPage }) => {
  const router = useRouter();

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
      router.push({
        pathname: "/youtube/keyword/page/[page]",
        query: { page: data.activePage },
      });
    },
    [router],
  );

  const { youtubeKeywords, totalPages } = getYoutubeKeywordIndexPage;

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
          キーワード一覧
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
        {youtubeKeywords.map((keyword, index) => {
          return (
            <Link key={index} href={`/youtube/keyword/${keyword.title}`} passHref>
              <Label
                tag
                size="large"
                css={css`
                  &&& {
                    margin: 15px 15px 0 12px;
                    padding-left: 1em;
                    padding-right: 0.5em;
                  }
                `}
              >
                <Icon
                  name="linkify"
                  css={css`
                    &&& {
                      margin: 0 5px 0 0;
                    }
                  `}
                />
                {keyword.title}
              </Label>
            </Link>
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

      <Divider />

      <div>
        <YoutubeIndexLinkButton />
        <TwitterIndexLinkButton />
        <InstagramIndexLinkButton />
        <TiktokIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
});
