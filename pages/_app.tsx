//@ts-nocheck
import React from 'react';
import {ThemeProvider} from '@mui/material';
import {appTheme} from '../src/theme';
import {ApolloProvider} from '@apollo/client';
import client from '../src/middleware/graphql/apollo-client';
import type {AppProps /*, AppContext */, NextWebVitalsMetric} from 'next/app';

import {Provider} from 'react-redux';
// @ts-ignore
import {store} from '../src/store';
import Head from 'next/head';
import metrics from '../src/metrics';
import {SdkConnectionProvider} from '@/src/components/connector/sdk-connection-provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../src/components/Navbar';
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
      <ApolloProvider client={client}>
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
            .no-cursor {
              cursor: none;
            }
            .cursor-pointer {
              cursor: pointer;
            }
            .no-select {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            .overflow-y-scroll {
              overflow-y: scroll;
            }
            .z-2 {
              z-index: 2;
            }
            .z-3 {
              z-index: 3;
            }
            .MuiButton-startIcon {
              display: none !important;
            }
          `}
        </style>

        {/* <Provider session={pageProps.session} store={store}> */}
          <ThemeProvider theme={appTheme}>
            <EnvironmentSelectorProvider>
              {(connector: any): any => (
                <SdkConnectionProvider connector={connector}>
                  <Navbar />
                  <div id='tako' className='position-relative'>
                    <Component {...pageProps} />
                  </div>
                  {/* <ConnectionStatus /> */}
                </SdkConnectionProvider>
              )}
            </EnvironmentSelectorProvider>
          </ThemeProvider>
        {/* </Provider> */}
      </ApolloProvider>
    </>
  );
}

export default MyApp;
