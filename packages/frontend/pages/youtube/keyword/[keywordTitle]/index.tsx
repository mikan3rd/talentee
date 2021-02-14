import React from "react";

import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeKeywordIndex } from "@/components/pages/YoutubeKeywordIndex";
import { TopSection, YoutubeKeywordSection, YoutubeSection } from "@/components/templates/BreadcrumbSection";
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

export const getStaticProps: GetStaticProps<Props, { keywordTitle: string }> = async ({
  params,
}): Promise<GetStaticPropsResult<Props>> => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ keywordTitle: params.keywordTitle, page: 1 });
};

export const getCommonStaticProps = async ({ keywordTitle, page }: { keywordTitle: string; page: number }) => {
  const { data } = await client.query<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>({
    query: GetYoutubeKeywordRankingPageDocument,
    variables: { pagination: { take, page, keywordTitle } },
  });

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
  if (!props.getYoutubeKeywordRankingPage) {
    return null;
  }

  const { keywordTitle, page } = props;

  return (
    <>
      <Meta
        title={`Youtubeランキング - ${keywordTitle} (${page}ページ目)`}
        description={`人気のYoutubeランキング - ${keywordTitle}`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordSection keywordTitle={keywordTitle} active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeKeywordIndex {...props} />
    </>
  );
});
