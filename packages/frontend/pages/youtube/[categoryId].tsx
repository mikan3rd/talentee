import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeIndex } from "@/components/pages/YoutubeIndex";
import { TopSection, YoutubeSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeRankingPageDocument,
  GetYoutubeRankingPageQuery,
  GetYoutubeRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;
const AllCategory = "all" as const;

export const getServerSideProps: GetServerSideProps<Props, { categoryId: string }> = async ({
  query,
  params: { categoryId },
}) => {
  const page = query.page ? Number(query.page) : 1;
  const isAll = categoryId === AllCategory;
  const videoCategoryId = isAll ? undefined : Number(categoryId);

  const { data } = await client.query<GetYoutubeRankingPageQuery, GetYoutubeRankingPageQueryVariables>({
    query: GetYoutubeRankingPageDocument,
    variables: { pagination: { take, page, videoCategoryId, isAll } },
  });

  const allOption = { value: AllCategory, text: "すべてのカテゴリ" };
  const videoCategoryOptions = data.getYoutubeRankingPage.youtubeVideoCategories.map((category) => ({
    value: String(category.id),
    text: category.title,
  }));
  videoCategoryOptions.unshift(allOption);

  const selectedVideoCategory = isAll
    ? allOption
    : videoCategoryOptions.find((category) => category.value === String(videoCategoryId));

  if (!data.getYoutubeRankingPage.youtubeChannels.length || !selectedVideoCategory) {
    return { notFound: true };
  }

  return {
    props: {
      take,
      page,
      videoCategoryOptions,
      selectedVideoCategory,
      ...data.getYoutubeRankingPage,
    },
  };
};

export default React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
  const { selectedVideoCategory, page } = props;
  return (
    <>
      <Meta
        title={`Youtubeランキング - ${selectedVideoCategory.value} (${page}ページ目)`}
        description={`人気のYoutubeランキング - ${selectedVideoCategory.value}`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeIndex {...props} />
    </>
  );
});
