import React from "react";

import { GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Constants } from "@/common/constants";
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  return await getCommonStaticProps({ page: 1 });
};

export const getCommonStaticProps = async ({ page }: { page: number }): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetTiktokRankingPageQuery, GetTiktokRankingPageQueryVariables>({
    query: GetTiktokRankingPageDocument,
    variables: { pagination: { take, page } },
  });

  return {
    props: {
      take,
      page,
      ...data.getTiktokRankingPage,
    },
    revalidate: Constants.revalidateTime,
  };
};

const TiktokIndexPage = React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { page } = props;

  return (
    <>
      <Meta
        title={`TikTokランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`人気のTikTokランキング${page > 1 ? ` (${page}ページ目)` : ""}`}
      />

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
