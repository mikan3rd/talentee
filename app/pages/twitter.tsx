import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { TwitterIndex } from "../components/pages/TwitterIndex";
import { Meta } from "../components/templates/Meta";
import { TopSection, TwitterSection } from "../components/templates/BreadcrumbSection";

const TwitterIndexPage: React.FC = () => {
  return (
    <>
      <Meta title="Twitter" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TwitterSection active={true} />
      </Breadcrumb>

      <Divider />

      <TwitterIndex />
    </>
  );
};

export default TwitterIndexPage;