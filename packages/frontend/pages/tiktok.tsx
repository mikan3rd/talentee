import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, TiktokIndex } from "@/components/pages/TiktokIndex";
import { TiktokSection, TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetTiktokRankingPageDocument,
  GetTiktokRankingPageQuery,
  GetTiktokRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const page = query.page ? Number(query.page) : 1;
  const { data } = await client.query<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>({
    query: GetTiktokRankingPageDocument,
    variables: { pagination: { take, page } },
  });

  if (!data.getTiktokRankingPage || !data.getTiktokRankingPage.tiktokUsers.length) {
    return { notFound: true };
  }

  return {
    props: {
      take,
      page,
      ...data.getTiktokRankingPage,
    },
  };
};

const TiktokIndexPage = React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
  return (
    <>
      <Meta title={`TikTokランキング (${props.page}ページ目)`} description="人気のTikTokランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TiktokSection active={true} />
      </Breadcrumb>

      <Divider />

      <TiktokIndex {...props} />
    </>
  );
});

export default TiktokIndexPage;
