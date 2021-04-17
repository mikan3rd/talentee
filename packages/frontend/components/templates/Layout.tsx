import React from "react";

import { css } from "@emotion/react";
import { SemanticToastContainer } from "react-semantic-toasts";
import TopBarProgress from "react-topbar-progress-indicator";
import { Container, Divider } from "semantic-ui-react";

import { ScrollTopButton } from "@/components/atoms/ScrollTopButton";
import { GoogleAdSense } from "@/components/molecules/GoogleAdSence";
import { Header } from "@/components/molecules/Header";
import { PcSidebar, PhoneSidebar } from "@/components/molecules/Sidebar";
import { useRouteChange } from "@/hooks/useRouteChange";
import { GlobalStyle } from "@/style/GlobalStyle";

export const Layout = React.memo(({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = React.useState(false);
  const { loading } = useRouteChange();

  const handleOpenSidebar = React.useCallback(() => {
    setIsOpenSidebar(true);
  }, []);

  const handleCloseSidebar = React.useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

  return (
    <>
      {GlobalStyle}

      <Header handleOpenSidebar={handleOpenSidebar} />

      <div
        css={css`
          min-height: 100vh;
          background-color: #f7f7f7;
          margin-left: 260px;
          @media (max-width: 600px) {
            margin-left: 0;
          }
        `}
      >
        <Container
          text
          css={css`
            margin-top: 0;
            padding: 10px 0 100px 0;
            @media (max-width: 600px) {
              margin-top: 60px;
            }
          `}
        >
          {children}

          <Divider />
          <GoogleAdSense />
        </Container>
      </div>

      <ScrollTopButton />

      <PcSidebar />
      <PhoneSidebar isOpenSidebar={isOpenSidebar} handleCloseSidebar={handleCloseSidebar} />

      <SemanticToastContainer position="top-center" />

      {loading && <TopBarProgress />}
    </>
  );
});
