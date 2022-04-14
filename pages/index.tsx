import {useRouter} from 'next/router';
import React from 'react';
import SEO from '../src/components/SEO';
import Button from '../src/components/common/button';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';
import TakoLink from '../src/components/TakoLink';

export default function _Index() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;
  const router = useRouter();
  return (
    <>
      <SEO
        title='Tako Labs'
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <style jsx>
        {`
          .mt-neg-5 {
            margin-top: -5rem;
          }
        `}
      </style>
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        <div className='mt-neg-5'>
          <h1 className='display-1'>TAKO LABS</h1>
          <p>Evolution is Infinite</p>
          {connection.state.status == 'disconnected' ? (
            <TakoLink href={`/connect`} as={`/connect`}>
              <a className='btn btn-outline-dark fnt-color-black text-decoration-none'>
                Connect
              </a>
            </TakoLink>
          ) : (
            <TakoLink
              href={`/u/${connection.walletAddress}`}
              as={`/u/${connection.walletAddress}`}>
              <a className='btn btn-outline-dark fnt-color-black text-decoration-none'>
                Enter
              </a>
            </TakoLink>
          )}
        </div>
      </div>
    </>
  );
}
