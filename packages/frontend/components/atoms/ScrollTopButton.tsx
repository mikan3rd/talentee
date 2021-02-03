import React from "react";

import { css } from "@emotion/react";
import { Button } from "semantic-ui-react";

export const ScrollTopButton = React.memo(() => {
  const [isTop, setIsTop] = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => {
      const result = window.pageYOffset <= 1000;
      if (result !== isTop) {
        setIsTop(result);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [isTop]);

  return (
    <Button
      circular
      color="teal"
      icon="chevron up"
      size="big"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      css={css`
        &&& {
          position: fixed;
          visibility: ${isTop ? "hidden" : "visible"};
          opacity: ${isTop ? 0 : 1};
          bottom: 50px;
          right: 10px;
          transition: all 0.5s ease;
        }
      `}
    />
  );
});
