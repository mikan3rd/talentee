import { GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeKeywordRankingIndex";
import YoutubeKeywordPage, { getCommonStaticProps, getStaticPaths } from "@/pages/youtube/keyword/[keywordParams]";

export { getStaticPaths };

export const getStaticProps: GetStaticProps<Props, { keywordParams: string; page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  return await getCommonStaticProps({ keywordParams: params.keywordParams, page: Number(params.page) });
};

export default YoutubeKeywordPage;
