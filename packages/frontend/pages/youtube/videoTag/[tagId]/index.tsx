import React from "react";

import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Props, YoutubeVideoTagRankingIndex } from "@/components/pages/YoutubeVideoTagRankingIndex";
import {
  TopSection,
  YoutubeSection,
  YoutubeVideoTagIndexSection,
  YoutubeVideoTagSection,
} from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import {
  GetYoutubeVideoTagRankingPageDocument,
  GetYoutubeVideoTagRankingPageQuery,
  GetYoutubeVideoTagRankingPageQueryVariables,
} from "@/graphql/generated";

const take = 10;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps: GetStaticProps<Props, { tagId: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ tagId: Number(params.tagId), page: 1 });
};

export const getCommonStaticProps = async ({
  tagId,
  page,
}: {
  tagId: number;
  page: number;
}): Promise<GetStaticPropsResult<Props>> => {
  const { data } = await client.query<GetYoutubeVideoTagRankingPageQuery, GetYoutubeVideoTagRankingPageQueryVariables>({
    query: GetYoutubeVideoTagRankingPageDocument,
    variables: { pagination: { take, page, tagId } },
  });

  if (!data.getYoutubeVideoTagRankingPage.youtubeTag) {
    return { redirect: { statusCode: 302, destination: "/youtube/videoTag" } };
  }

  return {
    props: {
      take,
      page,
      getYoutubeKeywordRankingPage: data.getYoutubeVideoTagRankingPage,
    },
    revalidate: 60 * 10,
  };
};

export default React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return null;
  }

  const {
    getYoutubeKeywordRankingPage: { youtubeTag },
    page,
  } = props;

  if (!youtubeTag) {
    return null;
  }

  return (
    <>
      <Meta
        title={`${youtubeTag?.title}の動画で人気のYouTuberランキング！${page > 1 ? ` (${page}ページ目)` : ""}`}
        description={`「${youtubeTag?.title}」の動画で人気のYouTubeチャンネルをチェック！`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection />
        <Breadcrumb.Divider />
        <YoutubeVideoTagIndexSection />
        <Breadcrumb.Divider />
        <YoutubeVideoTagSection tagId={youtubeTag?.id} tagTitle={youtubeTag?.title} active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeVideoTagRankingIndex {...props} />
    </>
  );
});
