import {IRaribleSdk} from '@rarible/sdk/build/domain';
import React, {useCallback, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import AKKORO_LIB from '../../src/akkoro_lib';
import {connect as redux} from 'react-redux';
import {useRouter} from 'next/router';

import {ConnectorContext} from '../../src/components/connector/sdk-connection-provider';
import SEO from '../../src/components/SEO';
let NFT_Form = dynamic(() => import('../../src/components/NFTForm'), {
  ssr: false,
});

function Mint() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  const [nft, setNFT] = useState<any>({});
  useEffect(() => {
    // console.log(address);
    connection.state.status == 'disconnected' && router.push('/');
  }, []);

  return (
    <>
      <SEO
        title='Tako Labs'
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-column justify-content-center'>

      {connection.state.status == 'connected' ? (
        <NFT_Form response={nft} />
      ) : (
        <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
          Please Connect Wallet
        </div>
      )}
      </div>

    </>
  );
}

const mapStateToProps = (state) => ({
  sdk: state.session.sdk,
  address: state.session.address,
  blockchain: state.session.blockchain,
  connection: state.session.connection,
});
export default redux(mapStateToProps)(Mint);
