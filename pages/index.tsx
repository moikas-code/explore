import {useRouter} from 'next/router';
import React from 'react';
import SEO from '../src/components/SEO';
import Button from '../src/components/common/button';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';

export default function _Index() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
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
				  .mt-neg-5{
					 margin-top: -5rem;
					}
				`}
			</style>
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        <div className='mt-neg-5'>
          <h1 className='display-1'>TAKO LABS</h1>
          <p>{blockchain}</p>
          {connection.state.status == 'disconnected' ? (
            <Button onClick={() => router.push('/connect')}>Connect</Button>
          ) : (
            <div>More Coming Soon...</div>
          )}
        </div>
      </div>
    </>
  );
}
