import React, {useCallback, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import AKKORO_LIB from '../../src/akkoro_lib';
import {connect as redux} from 'react-redux';
import {useRouter} from 'next/router';

import {ConnectorContext} from '../../src/components/connector/sdk-connection-provider';
import SEO from '../../src/components/SEO';
import TakoLink from '../../src/components/TakoLink';

export default function Dragon() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  const {walletAddress} = router.query;
  const [address, setAddress] = useState<string | string[]>('');

  useEffect((): any => {
    connection.state.status == 'disconnected' && router.push('/');
  }, []);
  useEffect((): any => {
    if (connection.state.status == 'connected') {
      if (
        walletAddress !== null &&
        walletAddress !== undefined &&
        walletAddress !== connection.walletAddress
      ) {
        router.push('/');
        // console.log(walletAddress);
      }
    }
  }, [walletAddress]);
  useEffect((): any => {
    // console.log(router);
    walletAddress !== null &&
      walletAddress !== undefined &&
      setAddress(walletAddress);
  }, [walletAddress]);
  return (
    <>
      <SEO
        title={`Tako Labs - ${address}`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-column'>
        <p className='m-2'>Wait... Where is the Metaverse?</p>
        <p className='m-2'>{address}</p>
        
      </div>
    </>
  );
}
