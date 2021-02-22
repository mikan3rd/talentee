import React from "react";

import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
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
  fallback: true,
});

export const getStaticProps: GetStaticProps<Props, { keywordTitle: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ keywordTitle: params.keywordTitle, page: 1 });
};

export const getCommonStaticProps = async ({
  keywordTitle,
  page,
}: {
  keywordTitle: string;
  page: number;
}): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>({
    query: GetYoutubeKeywordRankingPageDocument,
    variables: { pagination: { take, page, keywordTitle } },
  });

  if (!data.getYoutubeKeywordRankingPage) {
    return { redirect: { statusCode: 302, destination: "/youtube/keyword" } };
  }

  return {
    props: {
      take,
      page,
      keywordTitle,
      getYoutubeKeywordRankingPage: data.getYoutubeKeywordRankingPage,
    },
    revalidate: 60 * 10,
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return null;
  }

  const { keywordTitle, page } = props;

  return (
    <>
      <Meta
        title={`${keywordTitle}で人気YouTuberランキング！${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`キーワード「${keywordTitle}」で人気のYouTubeチャンネルをチェック！`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordIndexSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordSection keywordTitle={keywordTitle} active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeKeywordRankingIndex {...props} />
    </>
  );
});
