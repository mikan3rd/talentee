import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Index } from "../components/pages/Index";
import { Meta } from "../components/templates/Meta";
import { TopSection } from "../components/templates/BreadcrumbSection";

const Top: React.FC = () => {
  return (
    <>
      <Meta title="Top" />

      <Breadcrumb size="big">
        <TopSection active={true} />
      </Breadcrumb>

      <Divider />

      <Index />
    </>
  );
};

export default Top;
