import React from "react";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { TiktokIndex } from "../components/pages/TiktokIndex";
import { Meta } from "../components/templates/Meta";
import { TiktokSection, TopSection } from "../components/templates/BreadcrumbSection";

const InstagramIndexPage: React.FC = () => {
  return (
    <>
      <Meta title="TikTok" description="人気のTikTokランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TiktokSection active={true} />
      </Breadcrumb>

      <Divider />

      <TiktokIndex />
    </>
  );
};

export default InstagramIndexPage;
