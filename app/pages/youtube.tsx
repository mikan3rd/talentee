import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { YoutubeIndex } from "../components/pages/YoutubeIndex";
import { Meta } from "../components/templates/Meta";
import { TopSection, YoutubeSection } from "../components/templates/BreadcrumbSection";

const Top: React.FC = () => {
  return (
    <>
      <Meta title="Youtube" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeIndex />
    </>
  );
};

export default Top;