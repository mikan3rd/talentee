import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { InstagramIndex } from "../components/pages/InstagramIndex";
import { Meta } from "../components/templates/Meta";
import { InstagramSection, TopSection } from "../components/templates/BreadcrumbSection";

const InstagramIndexPage: React.FC = () => {
  return (
    <>
      <Meta title="Instagram" description="人気のInstagramer一覧" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <InstagramSection active={true} />
      </Breadcrumb>

      <Divider />

      <InstagramIndex />
    </>
  );
};

export default InstagramIndexPage;
