import React from "react";
import { AppProps } from "next/app";
import dayjs from "dayjs";

import "dayjs/locale/ja";
dayjs.locale("ja");

import { Layout } from "../components/templates/Layout";

import "semantic-ui-css/semantic.min.css";
import "react-semantic-toasts/styles/react-semantic-alert.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
