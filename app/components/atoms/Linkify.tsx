import React from "react";
import ReactLinkify from "react-linkify";

const componentDecorator = (href: string, text: string, key: number) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

export const Linkify = React.memo(({ children }) => {
  return <ReactLinkify componentDecorator={componentDecorator}>{children}</ReactLinkify>;
});
