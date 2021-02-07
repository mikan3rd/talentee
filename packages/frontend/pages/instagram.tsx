import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { InstagramIndex, Props } from "@/components/pages/InstagramIndex";
import { InstagramSection, TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetInstagramRankingPageDocument,
  GetInstagramRankingPageQuery,
  GetInstagramRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const page = query.page ? Number(query.page) : 1;
  const { data } = await client.query<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>({
    query: GetInstagramRankingPageDocument,
    variables: { pagination: { take, page } },
  });

  if (!data.getInstagramRankingPage || !data.getInstagramRankingPage.instagramUsers.length) {
    return { notFound: true };
  }

  return {
    props: {
      take,
      page,
      ...data.getInstagramRankingPage,
    },
  };
};

const InstagramIndexPage = React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
  return (
    <>
      <Meta title={`Instagramランキング (${props.page}ページ目)`} description="人気のInstagramランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <InstagramSection active={true} />
      </Breadcrumb>

      <Divider />

      <InstagramIndex {...props} />
    </>
  );
});

export default InstagramIndexPage;
