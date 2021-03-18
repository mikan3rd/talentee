import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDebounce } from "react-use";
import {
  Divider,
  Header,
  Icon,
  Label,
  Pagination,
  PaginationProps,
  Search,
  SearchProps,
  SearchResultData,
} from "semantic-ui-react";

import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { GetYoutubeVideoTagIndexPageQuery, useSearchYoutubeKeywordByWordLazyQuery } from "@/graphql/generated";

export type Props = {
  page: number;
  take: number;
  getYoutubeVideoTagIndexPage: GetYoutubeVideoTagIndexPageQuery["getYoutubeVideoTagIndexPage"];
};

export const YoutubeVideoTagIndex = React.memo<Props>(({ page, take, getYoutubeVideoTagIndexPage }) => {
  const [searchText, setSearchText] = React.useState("");
  const [debounce, setDebounce] = React.useState(false);

  const router = useRouter();
  const [fetch, { data, loading }] = useSearchYoutubeKeywordByWordLazyQuery();

  useDebounce(
    () => {
      fetch({ variables: { input: { word: searchText, take: 10 } } });
      setDebounce(false);
    },
    1000,
    [searchText],
  );

  const handleSearchChange = React.useCallback((event: React.MouseEvent, data: SearchProps) => {
    setDebounce(true);
    setSearchText(data.value ?? "");
  }, []);

  const handleSelectResult = React.useCallback(
    (event: React.MouseEvent, data: SearchResultData) => {
      const keywordTitle = data.result.title;
      router.push({
        pathname: "/youtube/videoTag/[tagId]",
        query: { tagId: keywordTitle }, // TODO
      });
      setSearchText(keywordTitle);
    },
    [router],
  );

  const handlePageChange = React.useCallback(
    async (event: React.MouseEvent, data: PaginationProps) => {
      router.push({
        pathname: "/youtube/videoTag/page/[page]",
        query: { page: data.activePage },
      });
    },
    [router],
  );

  const { youtubeTags, totalPages } = getYoutubeVideoTagIndexPage;

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
          動画タグ一覧
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

      <Search
        value={searchText}
        onSearchChange={handleSearchChange}
        loading={loading || debounce}
        results={data?.searchYoutubeKeywordByWord.youtubeKeywords ?? []}
        minCharacters={0}
        noResultsMessage="見つかりませんでした"
        onResultSelect={handleSelectResult}
        input={{ fluid: true, placeholder: "動画タグを検索" }}
      />

      <Divider />

      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {youtubeTags.map((tag, index) => {
          return (
            <Link key={index} href={`/youtube/videoTag/${tag.id}`} passHref>
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
                {tag.title}
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
