import React from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Account, Props } from "@/components/pages/Account";
import { AccountSection, TopSection } from "@/components/templates/BreadcrumbSection";
import { Meta } from "@/components/templates/Meta";
import { client } from "@/graphql/client";
import { GetAccountPageDocument, GetAccountPageQuery, GetAccountPageQueryVariables } from "@/graphql/generated";

export const getServerSideProps: GetServerSideProps<Props, { accountId: string }> = async ({
  params: { accountId },
}) => {
  const { data } = await client.query<GetAccountPageQuery, GetAccountPageQueryVariables>({
    query: GetAccountPageDocument,
    variables: { uuid: accountId },
  });

  if (!data.getAccountPage) {
    return { redirect: { statusCode: 302, destination: "/" } };
  }

  return { props: data.getAccountPage };
};

const ProfilePage = React.memo<InferGetServerSidePropsType<typeof getServerSideProps>>((props) => {
  const { uuid, displayName } = props;

  return (
    <>
      <Meta title={displayName} description={`${displayName} のまとめページはコチラ！`} />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <AccountSection />
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
