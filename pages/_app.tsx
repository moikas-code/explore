//@ts-nocheck
import React from 'react';
import {ThemeProvider} from '@mui/material';
import {appTheme} from '../src/theme';
import {ApolloProvider} from '@apollo/client';
import client from '../src/middleware/grapghql/apollo-client';
import type {AppProps /*, AppContext */, NextWebVitalsMetric} from 'next/app';

import {Provider} from 'react-redux';
// @ts-ignore
import {store} from '../src/store';
import Head from 'next/head';
import metrics from '../src/metrics';
import {SdkConnectionProvider} from '../src/components/connector/sdk-connection-provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../src/components/navbar';
import dynamic from 'next/dynamic';
const EnvironmentSelectorProvider = dynamic(
  (): any =>
    import('../src/components/connector/environment-selector-provider').then(
      (mod) => mod.EnvironmentSelectorProvider
    ),
  {ssr: false}
);

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link href='bootstrap/dist/css/bootstrap.min.css' />
      </Head>
      <style jsx global>
        {`
          html,
          body,
          #__next {
            height: 100%;
            font-family: monospace;
          }
          #tako {
            height: calc(100% - 23px);
          }
          .fnt-color-black {
            color: #000;
          }
          .fnt-color-black:hover {
            color: #000;
          }
          .text-decoraction-none {
            text-decoration: none;
          }
        `}
      </style>

      <ApolloProvider client={client}>
        <Provider session={pageProps.session} store={store}>
          <ThemeProvider theme={appTheme}>
            <EnvironmentSelectorProvider>
              {(connector: any): any => (
                <SdkConnectionProvider connector={connector}>
                  <Navbar />
                  <div id='tako'>
                    <Component {...pageProps} />
                  </div>
                  {/* <ConnectionStatus /> */}
                </SdkConnectionProvider>
              )}
            </EnvironmentSelectorProvider>
          </ThemeProvider>
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
