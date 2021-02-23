import React from "react";

import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { Button, Divider, Header, Icon, Menu, Pagination, PaginationProps } from "semantic-ui-react";

import { toRankingNumByPagination } from "@/common/utils";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
  YoutubeKeywordLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { YoutubeCard } from "@/components/organisms/YoutubeCard";
import { GetYoutubeCategoryRankingPageQuery } from "@/graphql/generated";
import { useScrollDirection } from "@/hooks/useScrollDirection";

type CategoryOption = { value: string; text: string };

export type Props = {
  page: number;
  take: number;
  videoCategoryOptions: CategoryOption[];
  selectedVideoCategory: CategoryOption;
  getYoutubeCategoryRankingPage: GetYoutubeCategoryRankingPageQuery["getYoutubeCategoryRankingPage"];
};

export const YoutubeIndex = React.memo<Props>(
  ({
    page,
    take,
    getYoutubeCategoryRankingPage: { totalPages, youtubeChannels },
    videoCategoryOptions,
    selectedVideoCategory,
  }) => {
    const router = useRouter();
    const isUp = useScrollDirection();

    const handlePageChange = React.useCallback(
      async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
        router.push({
          pathname: "/youtube/category/[categoryId]/page/[page]",
          query: { categoryId: selectedVideoCategory.value, page: data.activePage },
        });
      },
      [router, selectedVideoCategory.value],
    );

    const handleOnClickCategory = (value: CategoryOption["value"]) => {
      router.push({
        pathname: "/youtube/category/[categoryId]",
        query: { categoryId: value },
      });
    };

    React.useEffect(() => {
      const menuEle = document.getElementById("youtube_category_menu");
      const targetEle = document.getElementById(`youtube_category_${selectedVideoCategory.value}`);
      menuEle?.scrollTo({ left: targetEle?.offsetLeft, behavior: "smooth" });
    }, [selectedVideoCategory.value]);

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
            {selectedVideoCategory.text}
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

        <Menu
          id="youtube_category_menu"
          secondary
          css={css`
            &&& {
              position: sticky;
              top: ${isUp ? `60px` : 0};
              z-index: 1;
              margin: 20px 0 0 0;
              background-color: #f7f7f7;
              transition: all 0.5s ease;
              overflow-x: auto;
              padding: 5px 0;
              .item {
                transition: all 0.5s ease !important;
              }
            }
          `}
        >
          {videoCategoryOptions.map((option) => {
            return (
              <Menu.Item
                key={option.value}
                id={`youtube_category_${option.value}`}
                css={css`
                  &&&& {
                    padding: 0;
                    height: 36px;
                  }
                `}
              >
                <Button
                  color="red"
                  basic={option.value !== selectedVideoCategory.value}
                  active={option.value === selectedVideoCategory.value}
                  onClick={() => handleOnClickCategory(option.value)}
                >
                  {option.text}
                </Button>
              </Menu.Item>
            );
          })}
        </Menu>

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
