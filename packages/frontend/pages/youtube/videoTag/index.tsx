import React from "react";

import { GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeVideoTagIndex } from "@/components/pages/YoutubeVideoTagIndex";
import { TopSection, YoutubeSection, YoutubeVideoTagIndexSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeVideoTagIndexPageDocument,
  GetYoutubeVideoTagIndexPageQuery,
  GetYoutubeVideoTagIndexPageQueryVariables,
} from "@/graphql/generated";

const take = 50;

export const getStaticProps: GetStaticProps<Props> = async () => {
  return await getCommonStaticProps({ page: 1 });
};

export const getCommonStaticProps = async ({ page }: { page: number }): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetYoutubeVideoTagIndexPageQuery, GetYoutubeVideoTagIndexPageQueryVariables>({
    query: GetYoutubeVideoTagIndexPageDocument,
    variables: { pagination: { take, page } },
  });

  return {
    props: {
      take,
      page,
      getYoutubeVideoTagIndexPage: data.getYoutubeVideoTagIndexPage,
    },
    revalidate: 60 * 10,
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return null;
  }

  const { page } = props;

  return (
    <>
      <Meta
        title={`Youtubeランキング | 動画タグ一覧${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`Youtubeランキング | 動画タグ一覧${page > 1 ? ` (${page}ページ目)` : ""}`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeVideoTagIndexSection active />
      </Breadcrumb>

      <Divider />

      <YoutubeVideoTagIndex {...props} />
    </>
  );
});
