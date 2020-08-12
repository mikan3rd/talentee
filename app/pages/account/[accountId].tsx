import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";

import { IAccountData, getAccountPageData } from "../../fetchData/accountPageData";
import { Account } from "../../components/pages/Account";
import { Meta } from "../../components/templates/Meta";
import { IYoutubeData } from "../../hooks/useIndexData";

const ProfilePage: React.FC<{ data: string }> = ({ data }) => {
  const { accountData, youtubeData }: { accountData: IAccountData; youtubeData: IYoutubeData } = JSON.parse(data);

  if (!accountData) {
    Router.push("/");
    return null;
  }

  return (
    <>
      <Meta title={accountData.tmpUsername} />
      <Account accountData={accountData} youtubeData={youtubeData} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const accountId = params.accountId as string;
  const data = await getAccountPageData(accountId);
  return { props: { data } };
};

export default ProfilePage;
