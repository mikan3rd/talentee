import { GetStaticPaths, GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeVideoTagIndex";
import YoutubeKeywordIndexPage, { getCommonStaticProps } from "@/pages/youtube/videoTag";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  return await getCommonStaticProps({ page: Number(params.page) });
};

export default YoutubeKeywordIndexPage;
