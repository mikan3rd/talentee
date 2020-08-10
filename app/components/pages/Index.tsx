import React from "react";
import { css } from "@emotion/core";
import { Grid, Header, Image, Label, Segment } from "semantic-ui-react";

import { useIndexData } from "../../hooks/useIndexData";

export const Index: React.FC = () => {
  const { youtubeData } = useIndexData();

  return (
    <>
      {youtubeData &&
        youtubeData.map((data) => {
          const {
            id,
            snippet: { title },
            statistics: { subscriberCount },
          } = data;
          return <div key={id}>{title}</div>;
        })}
    </>
  );
};
