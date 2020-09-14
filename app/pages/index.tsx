import React from "react";
import { Breadcrumb } from "semantic-ui-react";

import { Index } from "../components/pages/Index";
import { Meta } from "../components/templates/Meta";
import { TopSection } from "../components/templates/BreadcrumbSection";

const Top = React.memo(() => {
  return (
    <>
      <Meta title="Top" />

      <Breadcrumb size="big">
        <TopSection active={true} />
      </Breadcrumb>

      <Index />
    </>
  );
});

export default Top;
