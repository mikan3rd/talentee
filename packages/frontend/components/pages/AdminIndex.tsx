import React from "react";

import { Container } from "semantic-ui-react";

import { AddAccountForm } from "@/components/organisms/AddAccountForm";
import { EditAccountForm } from "@/components/organisms/EditAccountForm";
import { useAuthContext } from "@/context/auth";

export const AdminIndex = React.memo(() => {
  const {
    state: { currentUser },
  } = useAuthContext();

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <AddAccountForm />
      <EditAccountForm />
    </Container>
  );
});
