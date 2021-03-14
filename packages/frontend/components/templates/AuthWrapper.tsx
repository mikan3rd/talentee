import React from "react";

import { Button, Dimmer, Icon, Loader, Message } from "semantic-ui-react";

import { useAuthContext } from "@/context/auth";
import { UserRole } from "@/graphql/generated";

export const AuthWrapper = React.memo<{ roles?: UserRole[] }>(({ roles = [], children }) => {
  const {
    state: { authStatus, firebaseUser, currentUser },
    login,
    logout,
  } = useAuthContext();

  if (authStatus === "initial" || authStatus === "loading") {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  if (authStatus === "completed" && (!firebaseUser || !currentUser)) {
    return (
      <>
        <Message positive header="ログインが必要なページです" />;
        <Button color="blue" size="big" onClick={login}>
          <Icon name="google" />
          Googleログイン
        </Button>
      </>
    );
  }

  if (!currentUser || !roles.includes(currentUser.role)) {
    return (
      <>
        <Message negative header="ページへのアクセス権がありません" />
        <Button color="blue" size="big" onClick={logout}>
          ログアウト
        </Button>
      </>
    );
  }

  return <>{children}</>;
});
