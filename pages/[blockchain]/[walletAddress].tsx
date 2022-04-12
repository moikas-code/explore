import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
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
// @ts-ignore
import TAKO from '@/src/tako';
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const router = useRouter();
  const {walletAddress} = router.query;
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [address, setAddress] = useState<string | string[]>('');
  const [assetType, setAssetType] = useState<string | string[]>('');
  const [contract, setContract] = useState<any>({
    name: '',
    symbol: '',
    baseURI: '',
    contractURI: '',
    isUserToken: false,
  });

  function getDeployRequest(_blockchain: string) {
    switch (_blockchain) {
      case 'POLYGON':
      case 'ETHEREUM':
        return {
          blockchain: _blockchain as CreateCollectionBlockchains,
          asset: {
            assetType: 'ERC721',
            arguments: {
              name: contract.name,
              symbol: contract.symbol,
              baseURI: contract.baseURI,
              contractURI: contract.contractURI,
              isUserToken: contract.isUserToken,
            },
          },
        } as CreateCollectionRequest;
      case 'TEZOS':
        return {
          blockchain: _blockchain as CreateCollectionBlockchains,
          asset: {
            assetType: 'NFT',
            arguments: {
              name: contract.name,
              symbol: contract.symbol,
              contractURI: contract.contractURI,
              isUserToken: contract.isUserToken,
            },
          },
        } as CreateCollectionRequest;
      default:
        throw new Error('Unsupported blockchain');
    }
  }

  useEffect((): any => {
    connection.state.status === 'disconnected' && router.push('/');
  }, [connection]);
  useEffect((): any => {
    if (connection.state.status === 'connected') {
      if (walletAddress !== null && walletAddress !== undefined) {
        // console.log('wallet address', walletAddress);
        if (walletAddress !== _address) {
          console.log('No Match');
          router.push('/');
        }
      }
    }
  }, [connection, walletAddress]);
  useEffect((): any => {
    // console.log(router);
    walletAddress !== null &&
      walletAddress !== undefined &&
      setAddress(walletAddress);
  }, [walletAddress]);

  useEffect((): any => {
    // console.log(router);
    walletAddress !== null &&
      walletAddress !== undefined &&
      TAKO.getCollectionsByOwner({
        blockChain: blockchain,
        address: walletAddress,
        continuation: '',
        size: 10,
      }).then((res) => console.log(res));
  }, [walletAddress]);
  return (
    <>
      <SEO
        title={`Tako Labs - ${address}`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-column position-relative h-100 m-2'>
        <p className=''>Wait... Where's my Metaverse?</p>
        <p className=''>{address}</p>
        <p>{blockchain}</p>
        <div className='d-flex flex-column'>
          <div>
            {(blockchain === 'POLYGON' ||
              blockchain === 'ETHEREUM' ||
              blockchain === 'TEZOS') && (
              <Button
                onClick={() => {
                  setShow(true);
                }}
                className={`btn btn-outline-dark`}>
                Create Contract
              </Button>
            )}
          </div>
          <div className='my-2 d-flex flex-row'>
            <div>My Collections</div>
          </div>
          <div></div>
        </div>
        {show && (
          <Modal
            onClose={() => {
              setShow(false);
              setShowOptions(false);
            }}>
            <div className='d-flex flex-column'>
              <Input
                label={'Collection Name* (min. 3 characters)'}
                value={''}
                onChange={(e) =>
                  setContract({...contract, name: e.target.value})
                }
                type='text'></Input>
              <Input
                label={'Collection Symbol* (min. 2 characters)'}
                value={''}
                onChange={(e) =>
                  setContract({...contract, symbol: e.target.value})
                }
                type='text'></Input>
              <div className=' my-1'>
                <p className='mb-0'>Contract Type* (select one)</p>
                <Select
                  className='text-black h-100 w-100'
                  label='Contract Type'
                  options={((): any => {
                    switch (blockchain) {
                      case 'POLYGON':
                      case 'ETHEREUM':
                        return [
                          {label: 'ERC721 (Singles)', value: 'ERC721'},
                          {label: 'ERC1155 (Multiples)', value: 'ERC1155'},
                        ];
                      case 'TEZOS':
                        return [{label: 'NFT', value: 'NFT'}, ,];

                      default:
                        break;
                    }
                  })()}
                  value={assetType}
                  onChange={(e) => {
                    setAssetType(e);
                    console.log(e);
                  }}
                />
              </div>
              <ToggleButton
                label={'Allow Public Minting?'}
                getToggleStatus={(res) => {
                  setContract({...contract, isUserToken: !res});
                }}
              />
              <div className='my-3'>
                <Button
                  className={`btn-outline-dark`}
                  onClick={() => {
                    setShowOptions(!showOptions);
                  }}>
                  Advanced Options:
                </Button>
                {showOptions && (
                  <div className=' mt-3 d-flex flex-column'>
                    <Input
                      label={'Contract URI'}
                      value={''}
                      onChange={(e) =>
                        setContract({...contract, contractURI: e.target.value})
                      }
                      type='text'></Input>
                    <Input
                      label={'Base URI'}
                      value={''}
                      onChange={(e) =>
                        setContract({...contract, baseURI: e.target.value})
                      }
                      type='text'></Input>
                  </div>
                )}
              </div>
              {
                <Button
                  disabled={
                    contract.name.length < 3 ||
                    contract.symbol.length < 2 ||
                    assetType.length < 1
                  }
                  className={`btn-outline-dark`}
                  onClick={async () => {
                    TAKO.createCollection(
                      sdk,
                      getDeployRequest(blockchain)
                    ).then((res) => {
                      console.log(res);
                    });
                  }}>
                  Deploy
                </Button>
              }
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
