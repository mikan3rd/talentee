import React from "react";

import { ApolloProvider } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import dayjs from "dayjs";
import { AppProps } from "next/app";
import smoothscroll from "smoothscroll-polyfill";

import "dayjs/locale/ja";
import "semantic-ui-css/semantic.min.css";
import "react-semantic-toasts/styles/react-semantic-alert.css";

import { Layout } from "@/components/templates/Layout";
import { client } from "@/graphql/client";

import "@/firebase/clientApp";

dayjs.locale("ja");

if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

Sentry.init({
  dsn: process.env.SENTRY_FRONTEND_DSN,
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.SENTRY_ENV,
  tracesSampleRate: 1.0,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
