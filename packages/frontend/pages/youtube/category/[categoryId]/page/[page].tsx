import { GetStaticProps } from "next";

import { Props } from "@/components/pages/YoutubeIndex";
import YoutubeCategoryPage, { getCommonStaticProps, getStaticPaths } from "@/pages/youtube/category/[categoryId]";

export { getStaticPaths };

export const getStaticProps: GetStaticProps<Props, { categoryId: string; page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ categoryId: params.categoryId, page: Number(params.page) });
};

export default YoutubeCategoryPage;
