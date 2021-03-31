import React from "react";

import { css } from "@emotion/react";
import Link from "next/link";
import { useDebounce } from "react-use";
import { Button, Header, Icon, Input, InputOnChangeData, Modal, Segment } from "semantic-ui-react";

import { AccountCard } from "@/components/organisms/AccountCard";
import { SearchAccountQuery, useSearchAccountLazyQuery } from "@/graphql/generated";

export const EditAccountForm = React.memo(() => {
  const [fetch, { data: searchResult, loading }] = useSearchAccountLazyQuery();

  const [searchText, setSearchText] = React.useState("");
  const [debounce, setDebounce] = React.useState(false);

  const [selectedAccount, setSelectedAccount] = React.useState<SearchAccountQuery["searchAccount"][number] | null>(
    null,
  );

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

  const handleCloseModal = React.useCallback(() => {
    setSelectedAccount(null);
  }, []);

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
                  onClick={() => setSelectedAccount(account)}
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
                <Header content="displayName" size="small" />
                <Link href="/account/[accountId]" as={`/account/${selectedAccount.uuid}`} passHref>
                  <Button as="a" target="_blank">
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
                  >
                    <Icon name="youtube" />
                    {channel.title}
                  </Button>
                ))}
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button content="キャンセル" onClick={handleCloseModal} />
              <Button positive content="更新" />
            </Modal.Actions>
          </>
        )}
      </Modal>
    </Segment>
  );
});
