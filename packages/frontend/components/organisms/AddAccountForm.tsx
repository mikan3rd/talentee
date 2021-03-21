import React from "react";

import { css } from "@emotion/react";
import { Button, Dropdown, Header, Input, Message, Segment } from "semantic-ui-react";

import { AccountCard } from "@/components/organisms/AccountCard";
import {
  AddAccountByUsernameMutation,
  FindAccountByUsernameQuery,
  useAddAccountByUsernameMutation,
  useFindAccountByUsernameLazyQuery,
} from "@/graphql/generated";

const serviceNames = [
  { value: "youtube", text: "YouTube" },
  { value: "twitter", text: "Twitter" },
  { value: "instagram", text: "Instagram" },
  { value: "tiktok", text: "TikTok" },
] as const;

const serviceOptions = serviceNames.map(({ value, text }) => ({ value, text }));
type ServiceValue = typeof serviceOptions[number]["value"];

export const AddAccountForm = React.memo(() => {
  const [username, setUsername] = React.useState("");
  const [selectedService, setSelectedService] = React.useState(serviceOptions[0].value as ServiceValue);

  const [checkedUsername, setCheckedUsername] = React.useState("");
  const [checkedSelectedService, setCheckedSelectedService] = React.useState(serviceOptions[0].value as ServiceValue);

  const [account, setAccount] = React.useState<FindAccountByUsernameQuery["findAccountByUsername"]>();
  const [createdAccount, setCreatedAccount] = React.useState<AddAccountByUsernameMutation["addAccountByUsername"]>();

  const handleFindAccountCompleted = React.useCallback(
    (data: FindAccountByUsernameQuery) => {
      setAccount(data.findAccountByUsername);
      setCreatedAccount(undefined);
      if (!data.findAccountByUsername) {
        setCheckedUsername(username);
        setCheckedSelectedService(selectedService);
      } else {
        setCheckedUsername("");
      }
    },
    [selectedService, username],
  );

  const [fetch] = useFindAccountByUsernameLazyQuery({
    onCompleted: handleFindAccountCompleted,
    fetchPolicy: "cache-and-network",
  });
  const [addAccount, { loading }] = useAddAccountByUsernameMutation();

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

  const handleAddAccount = React.useCallback(async () => {
    let youtubeChannelId: string | undefined;
    let twitterUsername: string | undefined;
    let instagramUsername: string | undefined;
    let tiktokUniqueId: string | undefined;

    switch (checkedSelectedService) {
      case "youtube":
        youtubeChannelId = checkedUsername;
        break;

      case "twitter":
        twitterUsername = checkedUsername;
        break;

      case "instagram":
        instagramUsername = checkedUsername;
        break;

      case "tiktok":
        tiktokUniqueId = checkedUsername;
        break;

      default:
        break;
    }

    const { data } = await addAccount({
      variables: { username: { youtubeChannelId, twitterUsername, instagramUsername, tiktokUniqueId } },
    });

    if (data) {
      setCreatedAccount(data.addAccountByUsername);
      setAccount(undefined);
      setCheckedUsername("");
    }
  }, [addAccount, checkedSelectedService, checkedUsername]);

  const selectedServiceOption = React.useMemo(
    () => serviceOptions.find((option) => option.value === checkedSelectedService),
    [checkedSelectedService],
  );

  return (
    <Segment>
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
          color="teal"
          disabled={!username}
          onClick={handleConfirm}
          css={css`
            &&& {
              margin-left: 10px;
            }
          `}
        />
      </div>
      {account && (
        <>
          <Message warning header="既にユーザーが存在します" />
          <AccountCard {...account} />
        </>
      )}

      {checkedUsername && (
        <>
          <Message
            success
            header="次の新規ユーザーを登録できます"
            content={`${selectedServiceOption?.text}\n${checkedUsername}`}
          />
          <Button content="登録" size="large" color="blue" loading={loading} onClick={handleAddAccount} />
        </>
      )}

      {createdAccount && (
        <>
          <Message success header="次のユーザーを作成しました" />
          <AccountCard {...createdAccount} />
        </>
      )}
    </Segment>
  );
});
