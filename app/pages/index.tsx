import React from "react";
import { GetServerSideProps } from "next";

import { getIndexPageData } from "../fetchData/indexPageData";

interface IYoutubeData {
  id: string;
  snippet: { title; description };
  statistics: { subscriberCount: number };
}

const Top: React.FC<{ data: { youtubeJsonData: string } }> = ({ data: { youtubeJsonData } }) => {
  const youtubeData: IYoutubeData[] = JSON.parse(youtubeJsonData);
  return (
    <div>
      {youtubeData.map((data) => {
        const {
          id,
          snippet: { title },
          statistics: { subscriberCount },
        } = data;
        return <div key={id}>{title}</div>;
      })}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const youtubeJsonData = await getIndexPageData();
  return { props: { data: { youtubeJsonData } } };
};

export default Top;
