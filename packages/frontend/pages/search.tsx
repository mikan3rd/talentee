import React from "react";

import { Breadcrumb, Divider } from "semantic-ui-react";

import { SearchIndex } from "@/components/pages/SearchIndex";
import { SearchSection, TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";

export default React.memo(() => {
  return (
    <>
      <Meta title="アカウント検索" />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <SearchSection active={true} />
      </Breadcrumb>

      <Divider />

      <SearchIndex />
    </>
  );
});
