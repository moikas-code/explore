import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {ConnectorContext} from './connector/sdk-connection-provider';
import {truncateAddress} from '../lib/moiWeb3';
import TakoLink from './TakoLink';
import WalletButton from './walletbutton';
function Navbar() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  return (
    <>
      <style jsx>{``}</style>
      <div className='d-flex flex-row justify-content-between ps-2 border border-dark'>
        <TakoLink href={'/'} as={'/'}>
          <a className='nav-brand fnt-color-black text-decoration-none'>
            Tako Labs
          </a>
        </TakoLink>
        <div title={connection.walletAddress}>
          <WalletButton address={connection.walletAddress}/>
        </div>
      </div>
    </>
  );
}
export default Navbar;
