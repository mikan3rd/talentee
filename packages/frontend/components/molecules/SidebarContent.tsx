import React from "react";

import Link from "next/link";
import { Menu } from "semantic-ui-react";

export const SidebarContent = React.memo(() => {
  return (
    <>
      <Link href="/" passHref>
        <Menu.Item content="TOP" />
      </Link>
      <Link href="/youtube/category/all" passHref>
        <Menu.Item content="YouTubeランキング" />
      </Link>
      <Link href="/twitter" passHref>
        <Menu.Item content="Twitterランキング" />
      </Link>
      <Link href="/instagram" passHref>
        <Menu.Item content="Instagramランキング" />
      </Link>
      <Link href="/tiktok" passHref>
        <Menu.Item content="TikTokランキング" />
      </Link>
      <Link href="/youtube/keyword" passHref>
        <Menu.Item content="YouTubeキーワード一覧" />
      </Link>
      <Link href="/search" passHref>
        <Menu.Item content="アカウント検索" />
      </Link>
    </>
  );
});
