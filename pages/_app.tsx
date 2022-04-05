import React from 'react';
import ReactDOM from 'react-dom';
// import { App } from "../src"
import {BrowserRouter} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {appTheme} from '../src/theme';
// import {ApolloProvider} from '@apollo/client';
// import client from '../src/middleware/graphql/apollo-client';
import type {AppProps /*, AppContext */, NextWebVitalsMetric} from 'next/app';

// import {Provider} from 'react-redux';
// @ts-ignore
// import {store} from '../src/store';
import Head from 'next/head';
// import metrics from '../src/metrics';

import {ConnectionStatus} from '../src/views/connect/connection-status';
import {SdkConnectionProvider} from '../src/components/connector/sdk-connection-provider';

import dynamic from 'next/dynamic';
const EnvironmentSelectorProvider = dynamic(
  (): any =>
    import('../src/components/connector/environment-selector-provider').then(
      (mod) => mod.EnvironmentSelectorProvider
    ),
  {ssr: false}
);
import 'bootstrap/dist/css/bootstrap.min.css';
function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      {/* <ApolloProvider client={client}> */}
      <CssBaseline />
      <style jsx global>
        {`
          html,
          body,
          #__next,
          #tako {
            height: 100%;
          }
        `}
      </style>
      <Head>
        <meta
          name='viewport'
          content='initial-scale=1.0, width=device-width'
          key='viewport'
        />
        {/* <link rel="stylesheet" href="/main.css" /> */}
        <link href='bootstrap/dist/css/bootstrap.min.css' />
      </Head>

      {/* <Provider session={pageProps.session} store={store}> */}
      {/* 
          Commented out Layout Component until one is created  
        */}
      {/* <Layout> */}
      <ThemeProvider theme={appTheme}>
        <EnvironmentSelectorProvider>
          {(connector: any): any => (
            <SdkConnectionProvider connector={connector}>
              <div id='tako'>
                <Component {...pageProps} />
              </div>
              <ConnectionStatus />
            </SdkConnectionProvider>
          )}
        </EnvironmentSelectorProvider>
      </ThemeProvider>
      {/* </Layout> */}
      {/* </Provider>
    </ApolloProvider> */}
    </>
  );
}

export default MyApp;
