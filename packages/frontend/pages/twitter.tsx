import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, TwitterIndex } from "@/components/pages/TwitterIndex";
import { TopSection, TwitterSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetTwitterRankingPageDocument,
  GetTwitterRankingPageQuery,
  GetTwitterRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const page = query.page ? Number(query.page) : 1;
  const { data } = await client.query<GetTwitterRankingPageQuery, GetTwitterRankingPageQueryVariables>({
    query: GetTwitterRankingPageDocument,
    variables: { pagination: { take, page } },
  });

  return {
    props: {
      take,
      page,
      ...data.getTwitterRankingPage,
    },
  };
};

const TwitterIndexPage = React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
  return (
    <>
      <Meta title={`Twitterランキング (${props.page}ページ目)`} description="人気のTwitterランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TwitterSection active={true} />
      </Breadcrumb>

      <Divider />

      <TwitterIndex {...props} />
    </>
  );
});

export default TwitterIndexPage;
