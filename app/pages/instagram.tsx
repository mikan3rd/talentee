import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { InstagramIndex } from "../components/pages/InstagramIndex";
import { Meta } from "../components/templates/Meta";
import { InstagramSection, TopSection } from "../components/templates/BreadcrumbSection";

const InstagramIndexPage = React.memo(() => {
  return (
    <>
      <Meta title="Instagramランキング" description="人気のInstagramランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <InstagramSection active={true} />
      </Breadcrumb>

      <Divider />

      <InstagramIndex />
    </>
  );
});

export default InstagramIndexPage;
