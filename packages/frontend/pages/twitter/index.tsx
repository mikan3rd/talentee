import React from "react";

import { GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Constants } from "@/common/constants";
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  return await getCommonStaticProps({ page: 1 });
};

export const getCommonStaticProps = async ({ page }: { page: number }): Promise<GetStaticPropsResult<Props>> => {
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
    revalidate: Constants.revalidateTime,
  };
};

const TwitterIndexPage = React.memo<InferGetStaticPropsType<typeof getCommonStaticProps>>((props) => {
  const { page } = props;

  return (
    <>
      <Meta
        title={`Twitterランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`人気のTwitterランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
      />

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
