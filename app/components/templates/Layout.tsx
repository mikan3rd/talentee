import React from "react";
import { css } from "@emotion/core";
import { Container } from "semantic-ui-react";
import { SemanticToastContainer } from "react-semantic-toasts";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <div
        css={css`
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          background-color: #f7f7f7;
        `}
      >
        <Container text>{children}</Container>
      </div>

      <SemanticToastContainer position="top-center" />
    </>
  );
};