import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";

import { getAccountPageData } from "../../fetchData/accountPageData";
import { Account } from "../../components/pages/Account";

const ProfilePage: React.FC<{ data: string }> = ({ data }) => {
  const { accountData, youtubeData } = JSON.parse(data);

  if (!accountData) {
    Router.push("/");
    return null;
  }

  return <Account accountData={accountData} youtubeData={youtubeData} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const accountId = params.accountId as string;
  const data = await getAccountPageData(accountId);
  return { props: { data } };
};

export default ProfilePage;
