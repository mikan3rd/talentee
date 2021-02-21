import React from "react";

import { GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  return await getCommonStaticProps({ page: 1 });
};

export const getCommonStaticProps = async ({ page }: { page: number }): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetInstagramRankingPageQuery, GetInstagramRankingPageQueryVariables>({
    query: GetInstagramRankingPageDocument,
    variables: { pagination: { take, page } },
  });

  return {
    props: {
      take,
      page,
      ...data.getInstagramRankingPage,
    },
    revalidate: 60 * 10,
  };
};

const InstagramIndexPage = React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return null;
  }

  const { page } = props;

  return (
    <>
      <Meta
        title={`Instagramランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`人気のInstagramランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
      />

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
