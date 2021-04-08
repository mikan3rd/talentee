import React from "react";

import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="google-site-verification" content="lhrIBgvKmE5lXsXKci8nY3wNNFe4PjfaLY6aZF7UjUM" />
          <script
            data-ad-client="ca-pub-2915249860974702"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
