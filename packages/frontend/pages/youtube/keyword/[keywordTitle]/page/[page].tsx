import { GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeKeywordIndex";
import YoutubeKeywordPage, { getCommonStaticProps, getStaticPaths } from "@/pages/youtube/keyword/[keywordTitle]";

export { getStaticPaths };

export const getStaticProps: GetStaticProps<Props, { keywordTitle: string; page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ keywordTitle: params.keywordTitle, page: Number(params.page) });
};

export default YoutubeKeywordPage;
