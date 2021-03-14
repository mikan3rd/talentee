import React from "react";

import { Container } from "semantic-ui-react";

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
      <div>TEST</div>
    </Container>
  );
});
