import React from "react";

import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeIndex } from "@/components/pages/YoutubeIndex";
import { TopSection, YoutubeCategorySection, YoutubeSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeCategoryRankingPageDocument,
  GetYoutubeCategoryRankingPageQuery,
  GetYoutubeCategoryRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;
const AllCategory = "all" as const;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { categoryId: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  return await getCommonStaticProps({ categoryId: params.categoryId, page: 1 });
};

export const getCommonStaticProps = async ({
  categoryId,
  page,
}: {
  categoryId: string;
  page: number;
}): Promise<GetStaticPropsResult<Props>> => {
  const isAll = categoryId === AllCategory;
  const videoCategoryId = isAll ? undefined : Number(categoryId);

  const { data } = await client.query<GetYoutubeCategoryRankingPageQuery, GetYoutubeCategoryRankingPageQueryVariables>({
    query: GetYoutubeCategoryRankingPageDocument,
    variables: { pagination: { take, page, videoCategoryId, isAll } },
  });

  const allOption = { value: AllCategory, text: "すべてのカテゴリ" };
  const videoCategoryOptions = data.getYoutubeCategoryRankingPage.youtubeVideoCategories.map((category) => ({
    value: String(category.id),
    text: category.title,
  }));
  videoCategoryOptions.unshift(allOption);

  const selectedVideoCategory = isAll
    ? allOption
    : videoCategoryOptions.find((category) => category.value === String(videoCategoryId));

  if (!selectedVideoCategory) {
    return { redirect: { permanent: false, destination: "/youtube/category/all" } };
  }

  return {
    props: {
      take,
      page,
      videoCategoryOptions,
      selectedVideoCategory,
      getYoutubeCategoryRankingPage: data.getYoutubeCategoryRankingPage,
    },
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { selectedVideoCategory, page } = props;
  return (
    <>
      <Meta
        title={`${selectedVideoCategory.text}で人気のYouTuberランキング！${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`${selectedVideoCategory.text}で人気のYouTuberランキングをチェック！`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <Breadcrumb.Section>カテゴリ</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <YoutubeCategorySection
          categoryName={selectedVideoCategory.text}
          categoryId={selectedVideoCategory.value}
          active
        />
      </Breadcrumb>

      <Divider />

      <YoutubeIndex {...props} />
    </>
  );
});
