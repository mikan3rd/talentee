import React from "react";

import { Dimmer, Loader } from "semantic-ui-react";

import { useAuthContext } from "@/context/auth";

export const AdminAuthWrapper = React.memo(({ children }) => {
  const [{ authStatus, firebaseUser }] = useAuthContext();
  console.log(authStatus);

  if (authStatus === "initial" || authStatus === "loading") {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  if (authStatus === "completed" && !firebaseUser) {
    return <>ログインが必要です</>;
  }

  return <>{children}</>;
});
