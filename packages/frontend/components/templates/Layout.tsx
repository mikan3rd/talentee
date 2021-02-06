import React from "react";

import { css } from "@emotion/react";
import { SemanticToastContainer } from "react-semantic-toasts";
import { Container } from "semantic-ui-react";

import { ScrollTopButton } from "@/components/atoms/ScrollTopButton";
import { Header } from "@/components/molecules/Header";
import { GlobalStyle } from "@/style/GlobalStyle";

export const Layout = React.memo(({ children }) => {
  return (
    <>
      {GlobalStyle}

      <div
        css={css`
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          background-color: #f7f7f7;
        `}
      >
        <Header />

        <Container
          text
          css={css`
            margin-top: 60px;
            padding: 10px 0 100px 0;
          `}
        >
          {children}
        </Container>

        <ScrollTopButton />
      </div>

      <SemanticToastContainer position="top-center" />
    </>
  );
});
