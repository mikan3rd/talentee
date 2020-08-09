import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { getIndexPageData } from "../fetchData/indexPageData";

const Top: React.FC<{
  data: InferGetServerSidePropsType<typeof getServerSideProps>;
}> = ({ data }) => {
  return <div>TEST</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const json = await getIndexPageData();
  return { props: { data: { json } } };
};

export default Top;
