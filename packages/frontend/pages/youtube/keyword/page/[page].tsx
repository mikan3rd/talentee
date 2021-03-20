import { GetStaticPaths, GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeKeywordIndex";
import YoutubeKeywordIndexPage, { getCommonStaticProps } from "@/pages/youtube/keyword";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ page: Number(params.page) });
};

export default YoutubeKeywordIndexPage;
