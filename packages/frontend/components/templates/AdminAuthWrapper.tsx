import React from "react";

import { Button, Dimmer, Icon, Loader } from "semantic-ui-react";

import { useAuthContext } from "@/context/auth";

export const AdminAuthWrapper = React.memo(({ children }) => {
  const {
    state: { authStatus, firebaseUser },
    login,
  } = useAuthContext();

  if (authStatus === "initial" || authStatus === "loading") {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  if (authStatus === "completed" && !firebaseUser) {
    return (
      <Button color="blue" size="big" onClick={login}>
        <Icon name="google" />
        Googleログイン
      </Button>
    );
  }

  return <>{children}</>;
});
