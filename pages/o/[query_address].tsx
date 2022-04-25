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
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;
// import ActivityWidget from '../../src/components/ActivityWidget';
const ActivityWidget: any = dynamic(
  () => import('../../src/components/ActivityWidget'),
  {ssr: false}
);
const query = gql`
  query Collections($input: QueryInput!) {
    Owned_Collections(input: $input) {
      total
      continuation
      collections {
        id
        parent
        blockchain
        type
        name
        symbol
        owner
        features
        minters
        meta {
          name
          description
          content {
            width
            height
            url
            representation
            mimeType
            size
          }
          externalLink
          sellerFeeBasisPoints
          feeRecipient
        }
      }
    }
  }
`;

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const router = useRouter();
  const {query_address}: any = router.query;
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [address, setAddress] = useState<string | string[]>('');
  const [chain, setChain] = useState<string | string[]>('ETHEREUM');
  const [assetType, setAssetType] = useState<any>('');
  const [contract, setContract] = useState<any>({
    name: '',
    symbol: '',
    baseURI: '',
    contractURI: '',
    isUserToken: false,
    operators: [],
  });

  const [Owned_Collections, {loading, error, data}] = useLazyQuery(query, {
    onCompleted: ({Owned_Collections}) => {
      if (Owned_Collections !== null && Owned_Collections !== undefined) {
        console.log(Owned_Collections);
        setComplete(true);
      }
    },
  });

  // useEffect((): any => {
  //   walletAddress !== null &&
  //     walletAddress !== undefined &&
  //     Owned_Collections({
  //       variables: {
  //         input: {
  //           blockChain: chain,
  //           address: walletAddress,
  //           continuation: '',
  //           size: 10,
  //         },
  //       },
  //     });
  //   return () => {
  //     setComplete(false);
  //   };
  // }, [walletAddress, chain]);

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
      <div className='d-flex flex-column position-relative h-100 p-2'>
        {typeof query_address !== 'undefined' && typeof query_address.split(':')[2] !== 'undefined' &&(
          <p className=''>Token ID: {query_address.split(':')[2]}</p>
        )}
        {typeof query_address !== 'undefined' && (
          <p className=''>NETWORK: {query_address.split(':')[0]}</p>
        )}
        {typeof query_address !== 'undefined' && (
          <p className=''>ADDDRESS: {query_address.split(':')[1]}</p>
        )}
        {typeof query_address !== 'undefined' && (
          <ActivityWidget address={query_address} />
        )}
      </div>
    </>
  );
}

function CollectionCard({children, ...props}: any) {
  return (
    <div
      title={props.title}
      onClick={props.onClick}
      className={`collection-card d-flex flex-column border rounded ${props.className}`}>
      <style>
        {`
        .collection-card {
          max-width: 31.25rem;
          width: 100%;
          min-width: 18.75rem;
          min-height: 9.375rem;

        }
      `}
      </style>
      {children}
    </div>
  );
}
