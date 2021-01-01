import React from "react";

import { Global, css } from "@emotion/react";

export const GlobalStyle = (
  <Global
    styles={css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        white-space: pre-wrap;
        word-break: break-word;
        -webkit-overflow-scrolling: touch;
      }
    `}
  />
);
