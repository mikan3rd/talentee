import React from "react";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Router from "next/router";
import Link from "next/link";
import Error from "next/error";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { getAccountPageData } from "../../fetchData/accountPageData";
import { Account } from "../../components/pages/Account";
import { Meta } from "../../components/templates/Meta";
import { AccountSection, TopSection } from "../../components/templates/BreadcrumbSection";

type Props = { data: { accountId: string; jsonData: string }; statusCode: number };

const ProfilePage = React.memo<Props>(({ data: { accountId, jsonData }, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />;
  }

  const {
    accountData,
    youtubeData,
    youtubePopularVideos,
    twitterUserData,
    popularTweets,
    instagramUserData,
    instagramPopularMedia,
    tiktokUserData,
    tiktokPopularItem,
  }: {
    accountData: AccountDataType;
    youtubeData?: IYoutubeData;
    youtubePopularVideos: IYoutubeVideoData[];
    twitterUserData?: TwitterUserDataType;
    popularTweets: TweetDataType[];
    instagramUserData: InstagramUserDataType;
    instagramPopularMedia: InstagramMediaType[];
    tiktokUserData: TiktokUserDataType;
    tiktokPopularItem: TiktokItemType[];
  } = JSON.parse(jsonData);

  if (!accountData) {
    Router.push("/");
    return null;
  }

  const { tmpUsername } = accountData;

  return (
    <>
      <Meta title={tmpUsername} description={`${tmpUsername} のまとめページはコチラ！`} />

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

      <Account
        accountData={accountData}
        youtubeData={youtubeData}
        youtubePopularVideos={youtubePopularVideos}
        twitterUserData={twitterUserData}
        popularTweets={popularTweets}
        instagramUserData={instagramUserData}
        instagramPopularMedia={instagramPopularMedia}
        tiktokUserData={tiktokUserData}
        tiktokPopularItem={tiktokPopularItem}
      />
    </>
  );
});

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const accountId = params.accountId as string;
  const jsonData = await getAccountPageData(accountId);

  let statusCode = 200;
  if (jsonData === null) {
    statusCode = 404;
  }

  const result: GetServerSidePropsResult<Props> = { props: { data: { accountId, jsonData }, statusCode } };
  return result;
};

export default ProfilePage;
