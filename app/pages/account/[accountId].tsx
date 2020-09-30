import React from "react";

import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Error from "next/error";
import Link from "next/link";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { Account } from "../../components/pages/Account";
import { AccountSection, TopSection } from "../../components/templates/BreadcrumbSection";
import { Meta } from "../../components/templates/Meta";
import { getAccountPageData } from "../../fetchData/accountPageData";

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
  let statusCode = 200;
  let accountId = "";
  let jsonData = "";

  if (!params) {
    statusCode = 404;
  } else {
    accountId = params.accountId as string;
    jsonData = await getAccountPageData(accountId);

    if (jsonData === null) {
      statusCode = 404;
    }
  }

  const result: GetServerSidePropsResult<Props> = { props: { data: { accountId, jsonData }, statusCode } };
  return result;
};

export default ProfilePage;
