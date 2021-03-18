import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { Menu } from "semantic-ui-react";

import { useAuthContext } from "@/context/auth";

export const SidebarContent = React.memo(() => {
  const {
    state: { firebaseUser },
    logout,
  } = useAuthContext();

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
        <Menu.Header content="Youtube" />
        <Menu.Menu>
          <Link href="/youtube/category/all" passHref>
            <Menu.Item content="ランキング" />
          </Link>
          <Link href="/youtube/keyword" passHref>
            <Menu.Item content="チャンネルキーワード一覧" />
          </Link>
          <Link href="/youtube/videoTag" passHref>
            <Menu.Item content="動画タグ一覧" />
          </Link>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header content="Twitter" />
        <Menu.Menu>
          <Link href="/twitter" passHref>
            <Menu.Item content="ランキング" />
          </Link>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header content="Instagram" />
        <Menu.Menu>
          <Link href="/instagram" passHref>
            <Menu.Item content="ランキング" />
          </Link>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header content="TikTok" />
        <Menu.Menu>
          <Link href="/tiktok" passHref>
            <Menu.Item content="ランキング" />
          </Link>
        </Menu.Menu>
      </Menu.Item>

      <Link href="/search" passHref>
        <Menu.Item content="アカウント検索" />
      </Link>

      {firebaseUser && <Menu.Item content="ログアウト" onClick={logout} />}
    </>
  );
});
