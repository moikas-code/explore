import React, {ReactNode, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
//@ts-ignore
import {ConnectorContext} from '@/src/components/connector/sdk-connection-provider';

import Select from 'react-select';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/common/button';
// @ts-ignore
import Modal from '@/src/components/common/modal';
// @ts-ignore
import Input from '@/src/components/common/input';
// @ts-ignore
import ToggleButton from '@/src/components/ToggleButton';

import {gql, useLazyQuery} from '@apollo/client';
import TakoLink from '../../src/components/TakoLink';
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;
// import ActivityWidget from '../../src/components/ActivityWidget';
const ActivityWidget: any = dynamic(
  () => import('../../src/components/ActivityWidget'),
  {ssr: false}
);
const OrderItems: any = dynamic(
  () => import('../../src/components/OrderItems'),
  {ssr: false}
);

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const router = useRouter();
  const {query_address}: any = router.query;
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);


  return (
    <>
      <SEO
        title={`Tako Labs - ${
          typeof query_address === 'string' ? query_address : 'Invalid Address'
        }`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-column position-relative p-2'>
        {console.log('hui',typeof query_address !== 'undefined' &&
          typeof query_address.split(':')[2] !== 'undefined')}
        {typeof query_address !== 'undefined' &&
          typeof query_address.split(':')[2] !== 'undefined' && (
            <p className=''>Token ID: {query_address.split(':')[2]}</p>
          )}
        {typeof query_address !== 'undefined' && (
          <p className=''>NETWORK: {query_address.split(':')[0]}</p>
        )}
        {typeof query_address !== 'undefined' && (
          <p className=''>
            ADDRESS:{' '}
            <TakoLink
              href={`/o/${query_address.split(':')[0]}:${
                query_address.split(':')[1]
              }`}
              as={`/o/${query_address.split(':')[0]}:${
                query_address.split(':')[1]
              }`}>
              {query_address.split(':')[1]}
            </TakoLink>
          </p>
        )}
        {true && (
            <OrderItems nid={query_address} />
          )}
        {typeof query_address !== 'undefined' && (
          <ActivityWidget address={query_address} />
        )}
      </div>
    </>
  );
}
