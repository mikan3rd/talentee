import React from "react";

import { css } from "@emotion/react";
import { useDebounce } from "react-use";
import { Button, Header, Input, InputOnChangeData, Segment } from "semantic-ui-react";

import { AccountCard } from "@/components/organisms/AccountCard";
import { useSearchAccountLazyQuery } from "@/graphql/generated";

export const EditAccountForm = React.memo(() => {
  const [fetch, { data, loading }] = useSearchAccountLazyQuery();

  const [searchText, setSearchText] = React.useState("");
  const [debounce, setDebounce] = React.useState(false);

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

  console.log(data);

  return (
    <Segment>
      <Header content="アカウント編集" />
      <form>
        <Input
          fluid
          placeholder="検索ワードを入力"
          value={searchText}
          onChange={handleSearchChange}
          loading={loading || debounce}
        />
      </form>
    </Segment>
  );
});
