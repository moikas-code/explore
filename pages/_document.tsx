//@ts-nocheck
import React from 'react';

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import {getLangFromReq} from '../src/utility/fromReq';
interface langType {
  lang: string;
}
const scriptTxt: string = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const base = document.createElement('base')

  base.href = ipfsMatch ? ipfsMatch[0] : '/'
  document.head.append(base)
})();
`;
class MyDocument extends Document<langType> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const lang = getLangFromReq(ctx.req);
    return {...initialProps, lang};
  }

  render(): JSX.Element {
    const {lang}: langType = this.props;
    return (
      <Html lang={lang}>
        <Head>
          <script dangerouslySetInnerHTML={{__html: scriptTxt}}/>
          <meta name='Description' content='KCP'></meta>
          <meta name='theme-color' content='#474c59' />

          <link rel='icon' href='/favicon.ico' />
          <link rel='manifest' href='/manifest.json' />
          <link
            href='/favicon-16x16.png'
            rel='icon'
            type='image/png'
            sizes='16x16'
          />
          <link
            href='/favicon-32x32.png'
            rel='icon'
            type='image/png'
            sizes='32x32'
          />
          <link rel='apple-touch-icon' href='/apple-touch-icon.png'></link>
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
