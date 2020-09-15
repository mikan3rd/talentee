import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Link from "next/link";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { getAccountPageData } from "../../fetchData/accountPageData";
import { Account } from "../../components/pages/Account";
import { Meta } from "../../components/templates/Meta";
import { AccountSection, TopSection } from "../../components/templates/BreadcrumbSection";

const ProfilePage = React.memo<{ data: { accountId: string; jsonData: string } }>(
  ({ data: { accountId, jsonData } }) => {
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
      accountData: IAccountData;
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
  },
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const accountId = params.accountId as string;
  const jsonData = await getAccountPageData(accountId);
  return { props: { data: { accountId, jsonData } } };
};

export default ProfilePage;
