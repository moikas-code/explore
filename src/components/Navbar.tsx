import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {ConnectorContext} from './connector/sdk-connection-provider';
import {truncateAddress} from '../lib/moiWeb3';
import Link from 'next/link';
function Navbar() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  return (
    <>
      <style jsx>{``}</style>
      <div className='d-flex flex-row justify-content-between px-2 border border-dark'>
        <Link href={'/'}>
          <a className='nav-brand fnt-color-black text-decoration-none'>
            Tako Labs
          </a>
        </Link>
        <div title={connection.walletAddress}>
          {truncateAddress(connection.walletAddress)}
        </div>
      </div>
    </>
  );
}
export default Navbar;
