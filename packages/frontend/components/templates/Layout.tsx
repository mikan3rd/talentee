import React from "react";

import { css } from "@emotion/react";
import { SemanticToastContainer } from "react-semantic-toasts";
import TopBarProgress from "react-topbar-progress-indicator";
import { Container, Menu, Sidebar } from "semantic-ui-react";

import { ScrollTopButton } from "@/components/atoms/ScrollTopButton";
import { Header } from "@/components/molecules/Header";
import { SidebarContent } from "@/components/molecules/SidebarContent";
import { useRouteChange } from "@/hooks/useRouteChange";
import { GlobalStyle } from "@/style/GlobalStyle";

export const Layout = React.memo(({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = React.useState(false);
  const { loading } = useRouteChange();

  const handleCloseSidebar = React.useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

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
        <Header setIsOpenSidebar={setIsOpenSidebar} />

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

      <Sidebar
        vertical
        inverted
        as={Menu}
        animation="overlay"
        visible={isOpenSidebar}
        onHide={handleCloseSidebar}
        onClick={handleCloseSidebar}
        css={css`
          &&& {
            display: none;
            @media (max-width: 600px) {
              display: block;
            }
          }
        `}
      >
        <SidebarContent />
      </Sidebar>

      <SemanticToastContainer position="top-center" />

      {loading && <TopBarProgress />}
    </>
  );
});
