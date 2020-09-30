import React from "react";

import { Breadcrumb, Divider } from "semantic-ui-react";

import { TiktokIndex } from "../components/pages/TiktokIndex";
import { TiktokSection, TopSection } from "../components/templates/BreadcrumbSection";
import { Meta } from "../components/templates/Meta";

const InstagramIndexPage = React.memo(() => {
  return (
    <>
      <Meta title="TikTokランキング" description="人気のTikTokランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TiktokSection active={true} />
      </Breadcrumb>

      <Divider />

      <TiktokIndex />
    </>
  );
});

export default InstagramIndexPage;
