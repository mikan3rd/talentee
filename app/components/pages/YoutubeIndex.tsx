import React from "react";

import { useIndexData } from "../../hooks/useIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";

export const YoutubeIndex: React.FC = () => {
  const { youtubeData } = useIndexData();

  return (
    <>
      {youtubeData &&
        youtubeData.map((data) => {
          return <YoutubeCard key={data.id} data={data} />;
        })}
    </>
  );
};
