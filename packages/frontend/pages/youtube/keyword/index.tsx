import React from "react";

import { GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeKeywordIndex } from "@/components/pages/YoutubeKeywordIndex";
import { TopSection, YoutubeKeywordIndexSection, YoutubeSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeKeywordIndexPageDocument,
  GetYoutubeKeywordIndexPageQuery,
  GetYoutubeKeywordIndexPageQueryVariables,
} from "@/graphql/generated";

const take = 50;

export const getStaticProps: GetStaticProps<Props> = async () => {
  return await getCommonStaticProps({ page: 1 });
};

export const getCommonStaticProps = async ({ page }: { page: number }): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetYoutubeKeywordIndexPageQuery, GetYoutubeKeywordIndexPageQueryVariables>({
    query: GetYoutubeKeywordIndexPageDocument,
    variables: { pagination: { take, page } },
  });

  return {
    props: {
      take,
      page,
      getYoutubeKeywordIndexPage: data.getYoutubeKeywordIndexPage,
    },
    revalidate: 60 * 10,
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { page } = props;

  return (
    <>
      <Meta
        title={`Youtubeランキング | キーワード一覧${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`Youtubeランキング | キーワード一覧${page > 1 ? ` (${page}ページ目)` : ""}`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeKeywordIndexSection active />
      </Breadcrumb>

      <Divider />

      <YoutubeKeywordIndex {...props} />
    </>
  );
});
