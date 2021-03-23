import { GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeVideoTagRankingIndex";
import YoutubeVideoTagPagePage, { getCommonStaticProps, getStaticPaths } from "@/pages/youtube/videoTag/[tagId]";

export { getStaticPaths };

export const getStaticProps: GetStaticProps<Props, { tagId: string; page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  return await getCommonStaticProps({ tagId: Number(params.tagId), page: Number(params.page) });
};

export default YoutubeVideoTagPagePage;
