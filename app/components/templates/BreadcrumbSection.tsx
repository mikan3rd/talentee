import React from "react";
import { Breadcrumb } from "semantic-ui-react";
import Link from "next/link";

export const TopSection: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <Link href="/">
      <Breadcrumb.Section href="/" active={active}>
        TOP
      </Breadcrumb.Section>
    </Link>
  );
};

export const YoutubeSection: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <Link href="/youtube">
      <Breadcrumb.Section href="/youtube" active={active}>
        YouTube
      </Breadcrumb.Section>
    </Link>
  );
};

export const TwitterSection: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return (
    <Link href="/youtube">
      <Breadcrumb.Section href="/twitter" active={active}>
        Twitter
      </Breadcrumb.Section>
    </Link>
  );
};

export const AccountSection: React.FC<{ active?: boolean }> = ({ active = false }) => {
  return <Breadcrumb.Section active={active}>Account</Breadcrumb.Section>;
};
