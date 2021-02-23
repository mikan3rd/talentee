import React from "react";

import { css } from "@emotion/react";
import { Dimmer, Menu, Sidebar } from "semantic-ui-react";

import { SidebarContent } from "@/components/molecules/SidebarContent";

export const PcSidebar = React.memo(() => {
  return (
    <Sidebar
      vertical
      inverted
      as={Menu}
      visible={true}
      css={css`
        &&& {
          display: block;
          @media (max-width: 600px) {
            display: none;
          }
        }
      `}
    >
      <SidebarContent />
    </Sidebar>
  );
});

export const PhoneSidebar = React.memo<{ isOpenSidebar: boolean; handleCloseSidebar: () => void }>(
  ({ isOpenSidebar, handleCloseSidebar }) => {
    return (
      <>
        <Dimmer
          page
          active={isOpenSidebar}
          css={css`
            &&& {
              z-index: 101;
              opacity: 0.6 !important;
            }
          `}
        />

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
      </>
    );
  },
);
