import React from 'react';
import {useRouter} from 'next/router';
//@ts-ignore
import TAKO from '@/src/tako';
import SEO from '../src/components/SEO';
import Button from '../src/components/common/button';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';

import Input from '../src/components/common/input';
export default function _Index() {

  const router = useRouter();
  const [hideHowTo, setShowHowTO] = React.useState(true);
  const [address, setAddress] = React.useState('');
  const [err, setErr] = React.useState('');
  const [showErr, setShowErr] = React.useState(false);
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
          .explorer {
            max-width: 600px;
            width: 100%;
            padding: 1rem;
          }
          .how-to-card {
            max-width: 25.5rem;
            width: 100%;
          }
          .how-to-card p {
            margin-bottom: 0;
          }
        `}
      </style>
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
        <div className='explorer w-100 d-flex flex-column mt-neg-5'>
          <h1 className='display-1'>TAKO LABS</h1>
          <p>Evolution is Infinite</p>

          <form
            className='d-flex flex-column'
            onSubmit={async (e) => {
              await e.preventDefault();
              TAKO.validateAddress(address)
                .then((res) => {
                  if (res.isValid) {
                    setErr('');
                    setShowErr(false);
                    router.push(`/o/${res.address}`);
                  } else {
                    console.log('res', res);
                    setErr(res.error);
                    setShowErr(true);
                  }
                })
                .catch((err) => {
                  console.log('err', err);
                  setErr(err);
                  setShowErr(true);
                });
              return false;
            }}>
            <Input
              label={'Enter Address (Collection,User,NFT)'}
              placeholder={
                'ETHEREUM:0x1337694208oO8314Bf3ac0769B87262146D879o3'
              }
              value={address}
              onChange={(e) => {
                e.isDefaultPrevented();
                setAddress(e.target.value);
              }}
              type='text'
            />
          </form>
          {showErr ? <p>{err}</p> : <br />}
          <span className='position-relative d-block w-100'>
            <Button
              className='btn btn-outline-dark'
              onClick={() => setShowHowTO(!hideHowTo)}>
              How to Query
            </Button>
            {!hideHowTo && (
              <div className='how-to-card d-flex flex-column justify-content-center my-3 position-absolute bg-white p-3 border border-dark'>
                <p className='w-100'>
                  NFT - BLOCKCHAIN:COLLECTION_ADDRESS:NFT_ID
                </p>
                <p>USER - BLOCKCHAIN:ADDRESS</p>
                <p>COLLECTION - BLOCKCHAIN:ADDRESS</p>
              </div>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
