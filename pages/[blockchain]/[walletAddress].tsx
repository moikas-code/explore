import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';
//@ts-ignore
import SEO from '@/src/components/SEO';

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  const {walletAddress} = router.query;
  const [address, setAddress] = useState<string | string[]>('');

  useEffect((): any => {
    connection.state.status == 'disconnected' && router.push('/');
  }, [connection]);
  useEffect((): any => {
    if (connection.state.status == 'connected') {
      if (walletAddress !== null && walletAddress !== undefined) {
        // console.log('wallet address', walletAddress);
        if (walletAddress !== connection.walletAddress) {
          console.log('No Match');
          router.push('/');
        }
      }
    }
  }, [connection, walletAddress]);
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
      <div className='d-flex flex-column m-2'>
        <p className=''>Wait... Where is the Metaverse?</p>
        <p className=''>{address}</p>
        <div className='d-flex flex-column'>
          <div className='d-flex flex-row'>
            <div>My Collections</div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
