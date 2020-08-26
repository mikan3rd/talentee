import React from "react";
import { AppProps } from "next/app";
import dayjs from "dayjs";
import smoothscroll from "smoothscroll-polyfill";

import "dayjs/locale/ja";
import "semantic-ui-css/semantic.min.css";
import "react-semantic-toasts/styles/react-semantic-alert.css";

import { Layout } from "../components/templates/Layout";

dayjs.locale("ja");

if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
