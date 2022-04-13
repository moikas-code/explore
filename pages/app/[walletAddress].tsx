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
import {gql, useLazyQuery} from '@apollo/client';
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const router = useRouter();
  const {walletAddress}: any = router.query;
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [address, setAddress] = useState<string | string[]>('');
  const [chain, setChain] = useState<string | string[]>('ETHEREUM');
  const [assetType, setAssetType] = useState<string | string[]>('');
  const [contract, setContract] = useState<any>({
    name: '',
    symbol: '',
    baseURI: '',
    contractURI: '',
    isUserToken: false,
  });

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
          minter
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

  const [Owned_Collections, {loading, error, data}] = useLazyQuery(query, {
    onCompleted: ({Owned_Collections}) => {
      if (Owned_Collections !== null && Owned_Collections !== undefined) {
        console.log(Owned_Collections.collections);
        setComplete(true);
      }
    },
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
    connection.state.status == 'disconnected' && router.push('/');
  }, [connection]);

  useEffect((): any => {
    if (walletAddress !== null && walletAddress !== undefined) {
      const addr_pref = walletAddress.substring(0, 2).toLowerCase();
      console.log('addr_pref', addr_pref, sdk);
      switch (addr_pref) {
        case '0x':
          if (walletAddress.length === 18) {
            setChain('FLOW');
            return;
          }
          if (typeof window !== undefined && window.web3 !== undefined) {
            const provider = window?.web3.currentProvider;
            console.log('>', provider.chainId);
            if (provider.chainId === '0x89' || provider.chainId === 137) {
              setChain('POLYGON');
              return;
            }
          }
          setChain('ETHEREUM');
          return;

        case 'tz':
          setChain('TEZOS');
          return;

        default:
          throw new Error('Unsupported blockchain');
      }
    }
  }),
    [walletAddress];

  useEffect((): any => {
    // console.log(router);
    walletAddress !== null &&
      walletAddress !== undefined &&
      setAddress(walletAddress);
  }, [walletAddress]);

  useEffect((): any => {
    // console.log(router);
    walletAddress !== null && walletAddress !== undefined;
    Owned_Collections({
      variables: {
        input: {
          blockChain: chain,
          address: walletAddress,
          continuation: '',
          size: 10,
        },
      },
    });
    return () => {
      setComplete(false);
    };
  }, [walletAddress, chain]);
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
        <p>{chain}</p>
        <div className='d-flex flex-column'>
          <div>
            {(chain === 'POLYGON' ||
              chain === 'ETHEREUM' ||
              chain === 'TEZOS') &&
              _address === walletAddress && (
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
            <div>Collections</div>
          </div>
          <div className='d-flex flex-row justify-content-center w-100'>
            <div className='d-flex flex-column flex-lg-row flex-wrap justify-content-between align-items-center'>
              {loading && <p>Loading...</p>}
              {complete &&
                data.Owned_Collections?.collections.map(
                  (
                    {id, name, symbol, owner, blockchain, type}: any,
                    key: string
                  ) => {
                    return (
                      <CollectionCard
                        key={key}
                        className='border m-2 p-2 d-flex flex-column justify-content-center'>
                        <div>Name: {name}</div>
                        <div>Symbol: {symbol}</div>
                        <div>Owner: {owner}</div>
                        <div>Blockchain: {blockchain}</div>
                        <div>Type: {type}</div>
                      </CollectionCard>
                    );
                  }
                )}
            </div>
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
                          setContract({
                            ...contract,
                            contractURI: e.target.value,
                          })
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
                        getDeployRequest(chain as any)
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
      </div>
    </>
  );
}

function CollectionCard({children, ...props}: any) {
  return (
    <div
      className={`collection-card d-flex flex-column border rounded ${props.className}`}>
      <style>
        {`
        .collection-card {
          min-width: 300px;
          min-height: 150px;

        }
      `}
      </style>
      {children}
    </div>
  );
}
