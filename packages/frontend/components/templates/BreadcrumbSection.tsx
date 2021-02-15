import React from "react";

import Link from "next/link";
import { Breadcrumb } from "semantic-ui-react";

export const TopSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/">
      <Breadcrumb.Section href="/" active={active}>
        TOP
      </Breadcrumb.Section>
    </Link>
  );
});

export const YoutubeSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/youtube/category/all">
      <Breadcrumb.Section href="/youtube/category/all" active={active}>
        YouTubeランキング
      </Breadcrumb.Section>
    </Link>
  );
});

export const YoutubeCategorySection = React.memo<{ active?: boolean; categoryName: string; categoryId: string }>(
  ({ categoryName, categoryId, active = false }) => {
    return (
      <Link href={`/youtube/category/${categoryId}`}>
        <Breadcrumb.Section href={`/youtube/keyword/${categoryId}`} active={active}>
          {categoryName}
        </Breadcrumb.Section>
      </Link>
    );
  },
);

export const YoutubeKeywordIndexSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/youtube/keyword">
      <Breadcrumb.Section href="/youtube/keyword" active={active}>
        キーワード
      </Breadcrumb.Section>
    </Link>
  );
});

export const YoutubeKeywordSection = React.memo<{ active?: boolean; keywordTitle: string }>(
  ({ keywordTitle, active = false }) => {
    return (
      <Link href={`/youtube/keyword/${keywordTitle}`}>
        <Breadcrumb.Section href={`/youtube/keyword/${keywordTitle}`} active={active}>
          {keywordTitle}
        </Breadcrumb.Section>
      </Link>
    );
  },
);

export const TwitterSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/twitter">
      <Breadcrumb.Section href="/twitter" active={active}>
        Twitterランキング
      </Breadcrumb.Section>
    </Link>
  );
});

export const InstagramSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/instagram">
      <Breadcrumb.Section href="/instagram" active={active}>
        Instagramランキング
      </Breadcrumb.Section>
    </Link>
  );
});

export const TiktokSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/tiktok">
      <Breadcrumb.Section href="/tiktok" active={active}>
        Tiktokランキング
      </Breadcrumb.Section>
    </Link>
  );
});

export const AccountSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return <Breadcrumb.Section active={active}>アカウント</Breadcrumb.Section>;
});

export const SearchSection = React.memo<{ active?: boolean }>(({ active = false }) => {
  return (
    <Link href="/search">
      <Breadcrumb.Section href="/search" active={active}>
        アカウント検索
      </Breadcrumb.Section>
    </Link>
  );
});
