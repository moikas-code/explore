import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {ConnectorContext} from './connector/sdk-connection-provider';
import {truncateAddress} from '../lib/moiWeb3';
import TakoLink from './TakoLink';
import WalletButton from './walletbutton';
import WalletButtonItem from './walletbuttonitem';
function Navbar() {
  const [show, setShow] = useState(false);
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  return (
    <>
      <style jsx>{`
        .navbar {
          height: 5rem;
        }
        .wallet-button-items {
          max-height: 18.75rem;
          width: 175px;
        }
      `}</style>
      <div className='position-relative bg-white z-3'>
        <div className='navbar d-flex flex-row justify-content-between ps-2 border border-dark'>
          <TakoLink href={'/'} as={'/'}>
            <a className='nav-brand fnt-color-black text-decoration-none'>
              Tako Labs
            </a>
          </TakoLink>
          <div title={connection.walletAddress}>
            <WalletButton
              isConnected={connection.state.status === 'connected'}
              onConnect={() => router.push('/connect')}
              onPress={() => setShow(!show)}
              address={connection.walletAddress}
            />
          </div>
        </div>
        {show && (
          <div
            className={`wallet-button-items d-flex flex-column bg-grey position-absolute end-0`}>
            <WalletButtonItem
              text={`Profile`}
              onPress={() => router.push(`/u/${connection.walletAddress}`)}
            />

            <WalletButtonItem
              text={`Disconnect`}
              onPress={() => router.push('/connect')}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Navbar;
