import {useRouter} from 'next/router';
import React from 'react';
import Button from '../src/components/Button';
import SEO from '../src/components/seo';
import dynamic from 'next/dynamic';
const ConnectorContext: any = dynamic(
  (): any =>
    import('../src/components/connector/sdk-connection-provider').then(
      (mod) => mod.ConnectorContext
    ),
  {ssr: false}
);
export default function _Index() {
  const connection: any = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  return (
    <>
      <SEO
        title='Tako Labs'
        description='Tako Labs is a Technology and Entertainment Commuinty'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        <div>
          <h1>TAKO LABS</h1>
          <p>{blockchain}</p>
          {connection.state.status == 'disconnected' ? (
            <Button onClick={() => router.push('/connect')}>Connect</Button>
          ) : (
            <div>Coming Soon...</div>
          )}
        </div>
      </div>
    </>
  );
}
