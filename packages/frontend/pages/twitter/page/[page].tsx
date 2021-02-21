import { GetStaticPaths, GetStaticProps } from "next";

import { Props } from "@/components/pages/TwitterIndex";
import TwitterIndexPage, { getCommonStaticProps } from "@/pages/twitter";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps: GetStaticProps<Props, { page: string }> = async ({ params }) => {
  if (!params) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return await getCommonStaticProps({ page: Number(params.page) });
};

export default TwitterIndexPage;
