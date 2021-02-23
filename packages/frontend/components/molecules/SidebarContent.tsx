import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { Menu } from "semantic-ui-react";

export const SidebarContent = React.memo(() => {
  return (
    <>
      <Link href="/" passHref>
        <Menu.Item>
          <img
            src="/logo_header.png"
            alt="Talentee"
            css={css`
              height: 60px;
              margin: 0;
            `}
          />
        </Menu.Item>
      </Link>

      <Link href="/" passHref>
        <Menu.Item content="TOP" />
      </Link>

      <Menu.Item>
        <Menu.Header content="ランキング" />
        <Menu.Menu>
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
        </Menu.Menu>
      </Menu.Item>

      <Link href="/youtube/keyword" passHref>
        <Menu.Item content="YouTubeキーワード一覧" />
      </Link>
      <Link href="/search" passHref>
        <Menu.Item content="アカウント検索" />
      </Link>
    </>
  );
});
