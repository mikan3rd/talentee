import React from "react";

import { Button, Container } from "semantic-ui-react";

import { useAuthContext } from "@/context/auth";

export const AdminIndex = React.memo(() => {
  const {
    state: { currentUser },
    logout,
  } = useAuthContext();

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <div>TEST</div>
      <Button color="blue" size="big" onClick={logout}>
        ログアウト
      </Button>
    </Container>
  );
});
