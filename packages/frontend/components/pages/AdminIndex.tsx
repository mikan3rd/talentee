import React from "react";

import { css } from "@emotion/react";
import { Button, Container, Dropdown, Header, Input, Message } from "semantic-ui-react";

import { AccountCard } from "@/components/organisms/AccountCard";
import { useAuthContext } from "@/context/auth";
import { useFindAccountByUsernameLazyQuery } from "@/graphql/generated";

const serviceNames = [
  { value: "youtube", text: "YouTube" },
  { value: "twitter", text: "Twitter" },
  { value: "instagram", text: "Instagram" },
  { value: "tiktok", text: "TikTok" },
] as const;

const serviceOptions = serviceNames.map(({ value, text }) => ({ value, text }));
type ServiceValue = typeof serviceOptions[number]["value"];

export const AdminIndex = React.memo(() => {
  const {
    state: { currentUser },
  } = useAuthContext();

  const [username, setUsername] = React.useState("");
  const [selectedService, setSelectedService] = React.useState(serviceOptions[0].value as ServiceValue);

  const [fetch, { data }] = useFindAccountByUsernameLazyQuery();
  console.log(data);

  const handleConfirm = React.useCallback(() => {
    let youtubeChannelId: string | undefined;
    let twitterUsername: string | undefined;
    let instagramUsername: string | undefined;
    let tiktokUniqueId: string | undefined;

    switch (selectedService) {
      case "youtube":
        youtubeChannelId = username;
        break;

      case "twitter":
        twitterUsername = username;
        break;

      case "instagram":
        instagramUsername = username;
        break;

      case "tiktok":
        tiktokUniqueId = username;
        break;

      default:
        break;
    }

    fetch({
      variables: { username: { youtubeChannelId, twitterUsername, instagramUsername, tiktokUniqueId } },
    });
  }, [fetch, selectedService, username]);

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <Header content="新規登録" />
      <div>
        <Dropdown
          selection
          compact
          options={serviceOptions}
          value={selectedService}
          onChange={(e, d) => setSelectedService(d.value as ServiceValue)}
        />
        <Input
          placeholder="username"
          value={username}
          onChange={(e, d) => setUsername(d.value)}
          css={css`
            margin-left: 10px;
          `}
        />
        <Button
          content="確認"
          size="large"
          disabled={!username}
          onClick={handleConfirm}
          css={css`
            &&& {
              margin-left: 10px;
            }
          `}
        />
      </div>
      {data && data.findAccountByUsername && (
        <>
          <Message warning content="既にユーザーが存在します" />
          <AccountCard {...data.findAccountByUsername} />
        </>
      )}
    </Container>
  );
});
