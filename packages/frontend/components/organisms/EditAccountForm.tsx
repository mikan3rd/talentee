import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { toast } from "react-semantic-toasts";
import { useDebounce } from "react-use";
import { Button, Divider, Header, Icon, Input, InputOnChangeData, Modal, Segment } from "semantic-ui-react";

import { AccountCard } from "@/components/organisms/AccountCard";
import { SearchAccountQuery, useSearchAccountLazyQuery, useUpdateAccountMutation } from "@/graphql/generated";

type Account = SearchAccountQuery["searchAccount"][number];

export const EditAccountForm = React.memo(() => {
  const [fetch, { data: searchResult, loading, refetch }] = useSearchAccountLazyQuery();
  const [updateAccount, { loading: updating }] = useUpdateAccountMutation();

  const [searchText, setSearchText] = React.useState("");
  const [debounce, setDebounce] = React.useState(false);

  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(null);

  useDebounce(
    () => {
      fetch({ variables: { pagination: { word: searchText, take: 10 } } });
      setDebounce(false);
    },
    1000,
    [searchText],
  );

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      setDebounce(true);
      setSearchText(data.value ?? "");
    },
    [],
  );

  const handleSetAccount = React.useCallback((account: Account | null) => {
    setSelectedAccount(account);
    setEditingAccount(account);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    handleSetAccount(null);
  }, [handleSetAccount]);

  const handleChangeDisplayName = React.useCallback((displayName: string) => {
    setEditingAccount((prev) => {
      if (prev !== null) {
        return { ...prev, displayName };
      }
      return null;
    });
  }, []);

  const handleUpdateAccount = React.useCallback(async () => {
    if (editingAccount !== null) {
      const { uuid, displayName } = editingAccount;
      await updateAccount({ variables: { account: { uuid, displayName } } });
      await refetch?.({ pagination: { word: searchText, take: 10 } });
      handleCloseModal();
      toast({
        type: "success",
        title: "更新しました！",
      });
    }
  }, [editingAccount, handleCloseModal, refetch, searchText, updateAccount]);

  return (
    <Segment>
      <Header content="アカウント編集" />
      <div>
        <Input
          fluid
          placeholder="検索ワードを入力"
          value={searchText}
          onChange={handleSearchChange}
          loading={loading || debounce}
        />

        {searchResult && (
          <div
            css={css`
              margin-top: 10px;
            `}
          >
            {searchResult.searchAccount.map((account) => (
              <div
                key={account.uuid}
                css={css`
                  display: flex;
                  margin-top: 10px;
                `}
              >
                <AccountCard
                  {...account}
                  linkTarget="_blank"
                  css={css`
                    flex-grow: 1;
                  `}
                />
                <Button
                  content="編集"
                  onClick={() => handleSetAccount(account)}
                  css={css`
                    &&& {
                      margin-left: 10px;
                    }
                  `}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={selectedAccount !== null} onClose={handleCloseModal}>
        {selectedAccount !== null && (
          <>
            <Modal.Header>アカウント編集</Modal.Header>
            <Modal.Content scrolling>
              <div>
                <Link href="/account/[accountId]" as={`/account/${selectedAccount.uuid}`} passHref>
                  <Button as="a" target="_blank" css={SocialButtonCss}>
                    <Icon name="home" />
                    {selectedAccount.displayName}
                  </Button>
                </Link>
                {selectedAccount.youtubeChannels.map((channel) => (
                  <Button
                    key={channel.id}
                    color="youtube"
                    as="a"
                    target="_blank"
                    href={`https://www.youtube.com/channel/${channel.id}`}
                    css={SocialButtonCss}
                  >
                    <Icon name="youtube" />
                    {channel.title}
                  </Button>
                ))}
                {selectedAccount.twitterUsers.map((user) => (
                  <Button
                    key={user.username}
                    color="twitter"
                    as="a"
                    target="_blank"
                    href={`https://twitter.com/${user.username}`}
                    css={SocialButtonCss}
                  >
                    <Icon name="twitter" />
                    {user.name}
                  </Button>
                ))}
                {selectedAccount.instagramUsers.map((user) => (
                  <Button
                    key={user.username}
                    color="instagram"
                    as="a"
                    target="_blank"
                    href={`https://instagram.com/${user.username}/`}
                    css={SocialButtonCss}
                  >
                    <Icon name="instagram" />
                    {user.fullName}
                  </Button>
                ))}
                {selectedAccount.tiktokUsers.map((user) => (
                  <Button
                    key={user.uniqueId}
                    color="black"
                    as="a"
                    target="_blank"
                    href={`https://www.tiktok.com/@${user.uniqueId}`}
                    css={SocialButtonCss}
                  >
                    <img
                      src="/icon_tiktok.svg"
                      alt="icon_tiktok"
                      css={css`
                        width: 100%;
                        width: 14px;
                        height: 12px;
                        margin-right: 5px;
                      `}
                    />
                    {user.nickname}
                  </Button>
                ))}
              </div>
              <Divider />
              <div>
                <Input
                  fluid
                  label="displayName"
                  value={editingAccount?.displayName}
                  onChange={(e, d) => handleChangeDisplayName(d.value)}
                />
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button content="キャンセル" onClick={handleCloseModal} />
              <Button positive content="更新" loading={updating} onClick={handleUpdateAccount} />
            </Modal.Actions>
          </>
        )}
      </Modal>
    </Segment>
  );
});

const SocialButtonCss = css`
  &&& {
    margin-top: 6px;
  }
`;
