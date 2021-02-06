import React from "react";

import { Breadcrumb, Divider } from "semantic-ui-react";

import { TwitterIndex } from "@/components/pages/TwitterIndex";
import { TopSection, TwitterSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";

const TwitterIndexPage = React.memo(() => {
  return (
    <>
      <Meta title="Twitterランキング" description="人気のTwitterランキング" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <TwitterSection active={true} />
      </Breadcrumb>

      <Divider />

      <TwitterIndex />
    </>
  );
});

export default TwitterIndexPage;
