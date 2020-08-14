import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Link from "next/link";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { IAccountData, getAccountPageData } from "../../fetchData/accountPageData";
import { Account } from "../../components/pages/Account";
import { Meta } from "../../components/templates/Meta";
import { IYoutubeData } from "../../hooks/useIndexData";
import { AccountSection, TopSection } from "../../components/templates/BreadcrumbSection";

const ProfilePage: React.FC<{ data: { accountId: string; jsonData: string } }> = ({
  data: { accountId, jsonData },
}) => {
  const { accountData, youtubeData }: { accountData: IAccountData; youtubeData: IYoutubeData } = JSON.parse(jsonData);

  if (!accountData) {
    Router.push("/");
    return null;
  }

  return (
    <>
      <Meta title={accountData.tmpUsername} />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <AccountSection />
        <Breadcrumb.Divider />
        <Link href={`/account/${accountId}`}>
          <Breadcrumb.Section href={`/account/${accountId}`} active={true}>
            {accountData.tmpUsername}
          </Breadcrumb.Section>
        </Link>
      </Breadcrumb>

      <Divider />

      <Account accountData={accountData} youtubeData={youtubeData} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const accountId = params.accountId as string;
  const jsonData = await getAccountPageData(accountId);
  return { props: { data: { accountId, jsonData } } };
};

export default ProfilePage;
