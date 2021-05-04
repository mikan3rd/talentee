import React from "react";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Breadcrumb } from "semantic-ui-react";

import { Constants } from "@/common/constants";
import { Index, Props } from "@/components/pages/Index";
import { TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import { GetTopPageDocument, GetTopPageQuery, GetTopPageQueryVariables } from "@/graphql/generated";

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { data } = await client.query<GetTopPageQuery, GetTopPageQueryVariables>({
    query: GetTopPageDocument,
  });
  return { props: data.getTopPage, revalidate: Constants.revalidateTime };
};

const Top = React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  return (
    <>
      <Meta title="Top" />

      <Breadcrumb size="big">
        <TopSection active={true} />
      </Breadcrumb>

      <Index {...props} />
    </>
  );
});

export default Top;
