import React from "react";

import { Index } from "../components/pages/Index";
import { Meta } from "../components/templates/Meta";

const Top: React.FC = () => {
  return (
    <>
      <Meta title="Top" />
      <Index />
    </>
  );
};

export default Top;
