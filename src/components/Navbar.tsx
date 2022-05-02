import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {ConnectorContext} from './connector/sdk-connection-provider';
import {truncateAddress} from '../lib/moiWeb3';
import TakoLink from './TakoLink';
import WalletButton from './walletbutton';
import WalletButtonItem from './walletbuttonitem';
//@ts-ignore
import TAKO from '@/src/tako';
import SearchBar from './Searchbar';
function Navbar() {
  const [show, setShow] = useState(false);
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  const [address, setAddress] = React.useState('');
  const [err, setErr] = React.useState<any>('');
  return (
    <>
      <style jsx>{`
        .navbar {
          height: 5rem;
        }
        .nav-brand {
          vertical-align: middle;
        }
        .wallet-button-items {
          max-height: 18.75rem;
          width: 175px;
        }
      `}</style>
      <div className='position-relative bg-white z-3'>
        <div className='navbar d-flex flex-row justify-content-between align-items-center border border-dark'>
          <span onClick={() => setShow(false)}>
            <TakoLink href={'/'} as={'/'}>
              <a className='d-flex flex-column justify-content-center h-100 fnt-color-black text-decoration-none text-center nav-brand width-10rem'>
                <span className='text-uppercase'>Tako Labs</span>
              </a>
            </TakoLink>
          </span>
          <SearchBar
            formStyle='d-none d-sm-flex col'
            placeholder='ETHEREUM:0x1337694208oO8314Bf3ac0769B87262146D879o3'
            label={''}
            value={address}
            errorMessage={err}
            isError={err.length > 0}
            onSubmit={(): any => {
              TAKO.validateAddress(address)
                .then((res) => {
                  if (res.isValid) {
                    setErr('');
                    router.push(`/o/${res.address}`);
                  } else {
                    console.log('res', res);
                    setErr(res.error);
                  }
                })
                .catch((err) => {
                  console.log('err', err);
                  setErr(err);
                });
            }}
            onChange={(e) => {
              setAddress(e);
              setErr('');
            }}
          />
          <div className='h-100' title={connection.walletAddress}>
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
              onPress={() => {
                router.push(`/k/${connection.walletAddress}`);
                setShow(false);
              }}
            />
            <WalletButtonItem
              text={`Order Feed`}
              onPress={() => {
                router.push('/orders');
                setShow(false);
              }}
            />

            <WalletButtonItem
              text={`Disconnect`}
              onPress={() => {
                router.push('/connect');
                setShow(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Navbar;
