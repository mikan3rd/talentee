import React from "react";

import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeKeywordRankingIndex } from "@/components/pages/YoutubeKeywordRankingIndex";
import {
  TopSection,
  YoutubeKeywordIndexSection,
  YoutubeKeywordSection,
  YoutubeSection,
} from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeKeywordRankingPageDocument,
  GetYoutubeKeywordRankingPageQuery,
  GetYoutubeKeywordRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { keywordTitle: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ keywordParams: params.keywordTitle, page: 1 });
};

export const getCommonStaticProps = async ({
  keywordParams,
  page,
}: {
  keywordParams: string;
  page: number;
}): Promise<GetStaticPropsResult<Props>> => {
  let keywordTitle: GetYoutubeKeywordRankingPageQueryVariables["pagination"]["keywordTitle"] = undefined;
  let keywordId: GetYoutubeKeywordRankingPageQueryVariables["pagination"]["keywordId"] = undefined;

  if (Number.isNaN(Number(keywordParams))) {
    keywordTitle = keywordParams;
  } else {
    keywordId = Number(keywordParams);
  }

  const { data } = await client.query<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>({
    query: GetYoutubeKeywordRankingPageDocument,
    variables: { pagination: { take, page, keywordTitle, keywordId } },
  });

  if (!data.getYoutubeKeywordRankingPage.youtubeKeyword) {
    return { redirect: { statusCode: 302, destination: "/youtube/keyword" } };
  }

  return {
    props: {
      take,
      page,
      getYoutubeKeywordRankingPage: data.getYoutubeKeywordRankingPage,
    },
    revalidate: 60 * 10,
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const {
    getYoutubeKeywordRankingPage: { youtubeKeyword },
    page,
  } = props;

  if (!youtubeKeyword) {
    return null;
  }

  return (
    <>
      <Meta
        title={`${youtubeKeyword.title}で人気のYouTuberランキング！${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`キーワード「${youtubeKeyword.title}」で人気のYouTubeチャンネルをチェック！`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordIndexSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordSection keywordId={youtubeKeyword.id} keywordTitle={youtubeKeyword.title} active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeKeywordRankingIndex {...props} />
    </>
  );
});
