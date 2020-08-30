import React from "react";
import { css } from "@emotion/core";
import Link from "next/link";
import { Image } from "semantic-ui-react";

import { useScrollDirection } from "../../hooks/useScrollDirection";

export const Header: React.FC = () => {
  const isUp = useScrollDirection();
  return (
    <Link href="/" passHref>
      <header
        css={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: black;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
          visibility: ${!isUp ? "hidden" : "visible"};
          opacity: ${!isUp ? 0 : 1};
          transition: all 0.5s ease;
        `}
      >
        <div
          css={css`
            height: 80%;
            margin-left: 10px;
          `}
        >
          <Image
            src="/logo_header.png"
            alt="Talentee"
            css={css`
              height: 100%;
            `}
          />
        </div>
      </header>
    </Link>
  );
};
