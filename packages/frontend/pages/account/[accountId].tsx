import React from "react";

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Constants } from "@/common/constants";
import { Account } from "@/components/pages/Account";
import { TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import { GetAccountPageDocument, GetAccountPageQuery, GetAccountPageQueryVariables } from "@/graphql/generated";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<React.ComponentProps<typeof Account>, { accountId: string }> = async ({
  params,
}) => {
  if (!params) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  const { data } = await client.query<GetAccountPageQuery, GetAccountPageQueryVariables>({
    query: GetAccountPageDocument,
    variables: { uuid: params?.accountId },
  });

  if (!data.getAccountPage) {
    return { redirect: { permanent: false, destination: "/" } };
  }

  return { props: { getAccountPage: data.getAccountPage }, revalidate: Constants.revalidateTime };
};

const ProfilePage = React.memo<InferGetStaticPropsType<typeof getStaticProps>>((props) => {
  const {
    getAccountPage: { uuid, displayName },
  } = props;

  return (
    <>
      <Meta title={`${displayName}のSNSアカウントまとめ！`} description={`${displayName}のSNSアカウントをチェック！`} />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <Link href={`/account/${uuid}`}>
          <Breadcrumb.Section href={`/account/${uuid}`} active={true}>
            {displayName}
          </Breadcrumb.Section>
        </Link>
      </Breadcrumb>

      <Divider />

      <Account {...props} />
    </>
  );
});

export default ProfilePage;
