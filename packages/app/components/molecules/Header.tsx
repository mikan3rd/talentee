import React from "react";

import { css } from "@emotion/core";
import Link from "next/link";
import { Button, Container, Icon, Image } from "semantic-ui-react";

import { useScrollDirection } from "../../hooks/useScrollDirection";

export const Header = React.memo(() => {
  const isUp = useScrollDirection();
  return (
    <header
      id="header"
      css={css`
        position: fixed;
        top: ${!isUp ? "-60px" : "0"};
        left: 0;
        right: 0;
        height: 60px;
        background-color: black;
        z-index: 1;
        transition: all 0.5s ease;
      `}
    >
      <Container
        text
        css={css`
          &&& {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        `}
      >
        <Link href="/" passHref>
          <a
            css={css`
              height: 80%;
            `}
          >
            <Image
              src="/logo_header.png"
              alt="Talentee"
              css={css`
                &&& {
                  height: 100%;
                }
              `}
            />
          </a>
        </Link>
        <Link href="/search" passHref>
          <Button icon inverted as="a">
            <Icon name="search" size="large" />
          </Button>
        </Link>
      </Container>
    </header>
  );
});
