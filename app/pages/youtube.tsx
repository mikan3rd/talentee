import React from "react";

import { YoutubeIndex } from "../components/pages/YoutubeIndex";
import { Meta } from "../components/templates/Meta";

const Top: React.FC = () => {
  return (
    <>
      <Meta title="Youtube" />
      <YoutubeIndex />
    </>
  );
};

export default Top;
