import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
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

export const getServerSideProps: GetServerSideProps<Props, { keywordTitle: string; page: string }> = async ({
  params,
}) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  const { keywordTitle } = params;
  const page = Number(params.page);

  const { data } = await client.query<GetYoutubeKeywordRankingPageQuery, GetYoutubeKeywordRankingPageQueryVariables>({
    query: GetYoutubeKeywordRankingPageDocument,
    variables: { pagination: { take, page, keywordTitle } },
  });

  return {
    props: {
      take,
      page,
      keywordTitle,
      ...data.getYoutubeKeywordRankingPage,
    },
  };
};

export default React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
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
