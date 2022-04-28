import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
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
// @ts-ignore
import {_metadata, _metadataTypes} from '../../src/lib/metadataSchema';
// @ts-ignore
import FormInputs from '../../src/components/FormInputs';
// @ts-ignore
import nft from '../../src/lib/nft-storage';
// @ts-ignore
import MediaViewer from '../../src/components/media-viewer';
import {MintRequest} from '@rarible/sdk/build/types/nft/mint/mint-request.type';
import {PrepareMintResponse} from '@rarible/sdk/build/types/nft/mint/domain';
import {
  toUnionAddress,
  UnionAddress,
  BigNumber,
  toBigNumber,
} from '@rarible/types';
import NFTInput from '../../src/components/NFTInput';
type CreateCollectionRequest = /*unresolved*/ any;
type CreateCollectionBlockchains = /*unresolved*/ any;
type MintFormProps = any;
interface NFTFormProps extends MintFormProps {
  address: UnionAddress;
  sdk: any;
  wallerAddress: any;
}

export default function Dragon() {
  const connection = React.useContext<any>(ConnectorContext);
  const sdk: string = connection.sdk;
  const _blockchain: string = connection.sdk?.wallet?.blockchain;
  const _address: string = connection.walletAddress;

  const router = useRouter();
  const {contractAddress}: any = router.query;
  const [contractLoadComplete, setcontractLoadComplete] = useState<boolean>(
    false
  );
  const [complete, setComplete] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [address, setAddress] = useState<string | string[]>('');
  const [chain, setChain] = useState<string | string[]>('ETHEREUM');
  const [continuation, setContinuation] = useState<string | string[]>('');
  const [collectionNfts, setCollectionNfts] = useState<any>([]);
  const [supply, setSupply] = useState<number>(1);
  const [lazyMint, setLazyMint] = useState<boolean>(true);
  const [royalties, setRoyalties] = useState<number>(0);
  const [currency, setCurrency] = useState<any>({
    value: {id: '1', '@type': 'ETH'},
    label: 'ETH',
  });
  const [currencyOptions, setCurrencyOptions] = useState<any>([]);
  const [sell_price, setSell_Price] = useState(0);
  const [sell_toggle, setSell_Toggle] = useState(true);

  const [state, setState] = useState({
    ..._metadata,
    type: '',
    attributes: [],
    token: '',
    disable: true,
    showInput: false,
    showMedia: false,
    isLoading: false,
    cid: '',
    canMint: false,
    fileData: '',
  });
  const [collectionInfo, setCollectionInfo] = useState<any>({
    id: '',
    parent: '',
    blockchain: '',
    type: '',
    name: '',
    symbol: '',
    owner: '',
    minters: [],
  });

  const queryCollections = gql`
    query Collections($input: QueryInput) {
      Collection_Info(input: $input) {
        id
        parent
        blockchain
        type
        name
        symbol
        owner
        minters
      }
    }
  `;

  const queryNFTS = gql`
    query NFTS($input: QueryInput) {
      Collection_NFTS(input: $input) {
        continuation
        items {
          id
          blockchain
          collection
          contract

          lazySupply
          mintedAt
          lastUpdatedAt
          meta {
            name
            description
            content {
              type
              width
              height
              url
              representation
              mimeType
              size
            }
          }
        }
      }
    }
  `;

  const [Collection_NFTS, {loading, refetch}] = useLazyQuery(queryNFTS, {
    onCompleted: async ({Collection_NFTS}) => {
      console.log(Collection_NFTS);
      if (
        Collection_NFTS !== null &&
        Collection_NFTS !== undefined &&
        Collection_NFTS.items !== null
      ) {
        let nfts: any = await Collection_NFTS.items;
        // nfts =
        let clean = await nfts.filter((nft: any) => {
          if (nft !== null && nft !== undefined) {
            if (nft.id !== null) {
              return true;
            }
          }
        });

        console.log(
          Collection_NFTS,
          'clean',
          clean,
          Collection_NFTS.continuation
        );
        setCollectionNfts([...collectionNfts, ...clean]);
        setContinuation(Collection_NFTS.continuation);
        setComplete(true);
      }
    },
  });

  const [Collection_Info] = useLazyQuery(queryCollections, {
    onCompleted: ({Collection_Info}) => {
      if (Collection_Info !== null && Collection_Info !== undefined) {
        Collection_NFTS({
          variables: {
            input: {
              address: Collection_Info.id,
              size: 25,
              continuation: '',
            },
          },
        });
        setcontractLoadComplete(true);
        setCollectionInfo(Collection_Info);
      }
    },
  });

  const handleFormResponses = (e: any, data: any) => {
    if (
      _metadataTypes[data + 'Type'] == 'string' ||
      _metadataTypes[data + 'Type'] == 'url' ||
      _metadataTypes[data + 'Type'] == 'color'
    ) {
      setState({...state, [data]: e.target.value});
    }
  };

  useEffect((): any => {
    connection.state.status == 'disconnected' && router.push('/');
  }, [connection]);

  useEffect((): any => {
    // console.log(router);
    contractAddress !== null &&
      contractAddress !== undefined &&
      setAddress(contractAddress);
  }, [contractAddress]);

  useEffect((): any => {
    Collection_Info({
      variables: {
        input: {
          blockChain: chain,
          address: address,
          continuation: '',
          size: 10,
        },
      },
    });

    return () => {
      setComplete(false);
    };
  }, [address, chain]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <style jsx>
        {`
          .nft-wrapper {
            width: 200px;
          }
        `}
      </style>
      <SEO
        title={`Tako Labs - ${address}`}
        description='TAKOLABS.IO: Tako Labs is a WEB3 Community that is focused on the development of decentralized applications and services alwhile providing gaming content.'
        twitter='takolabs'
        keywords='gaming, nfts, web3'
      />
      <p className='border-bottom'>
        Collection Address: {address.split(':')[1]}
      </p>
      <div className='d-flex flex-column position-relative h-100 m-2'>
        {contractLoadComplete && (
          <>
            <p>
              {collectionInfo.name} {collectionInfo.symbol}
            </p>

            <p>{collectionInfo.blockchain}</p>
          </>
        )}

        <div className='d-flex flex-column mb-2'>
          <div className='d-flex flex-row'>
            <Button
              onClick={() => {
                refetch({
                  input: {
                    address: collectionInfo.id,
                    size: 25,
                    continuation: continuation,
                  },
                });
                setComplete(false);
              }}
              className={`btn btn-outline-dark`}>
              Load More
            </Button>
            {_blockchain === collectionInfo.blockchain &&
              _blockchain === collectionInfo.blockchain && (
                <Button
                  onClick={() => {
                    setShow(true);
                  }}
                  className={`btn btn-outline-dark`}>
                  Mint NFT
                </Button>
              )}
          </div>
          <div className='my-2 d-flex flex-row'>
            <div>Collection NFTs</div>
          </div>
          {complete ? (
            <div className='d-flex flex-column justify-content-center align-items-center w-100'>
              <div className='d-flex flex-row flex-wrap justify-content-evenly align-items-center'>
                {collectionNfts.map(
                  (
                    {id, name, description, url, blockchain, meta}: any,
                    key: string
                  ) => {
                    return (
                      <a
                        rel='noreferrer'
                        target='_blank'
                        key={key}
                        href={`https://rarible.com/token/${id.split(':')[1]}:${
                          id.split(':')[2]
                        }`}>
                        <div className='nft-wrapper d-flex flex-column align-items-center cursor-pointer'>
                          {meta !== null ? (
                            <>
                              <div className='img-wrap m-2'>
                                <img
                                  className='h-100 w-100'
                                  src={meta.content[0].url}
                                  alt={meta.name}
                                />
                              </div>
                              <p className='text-wrap'>{meta.name}</p>
                              <p>{description}</p>
                            </>
                          ) : (
                            <div className='border img-wrap d-flex justify-content-center align-items-center m-2'>
                              <div className='text-wrap mx-auto text-center'>
                                Metadata In Transit
                              </div>
                            </div>
                          )}
                        </div>
                      </a>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => {
            refetch({
              input: {
                address: collectionInfo.id,
                size: 25,
                continuation: continuation,
              },
            });
            setComplete(false);
          }}
          className={`btn btn-outline-dark`}>
          Load More
        </Button>
      </div>

      {show && (
        <Modal
          onClose={() => {
            setShow(false);
            setShowOptions(false);
          }}>
          {/* TOP SECTION */}
          <div
            className={`col p-2 border border-dark d-inline-flex flex-column w-100 form-mx`}>
            <div className='d-flex flex-row'>
              <div className='p-3'>
                <NFTInput
                  id={'nft-input'}
                  accept={'.png,gif,jpg,jpeg'}
                  label={'Upload File:'}
                  onChange={async (e: any): Promise<void> => {
                    const {cid, fileType}: any = e;
                    console.log('?', cid, fileType);
                    setState({
                      ...state,
                      canMint:
                        fileType !== undefined &&
                        fileType.split('/')[0] == 'image'
                          ? true
                          : false,
                      fileData:
                        fileType !== undefined &&
                        fileType.split('/')[0] == 'image'
                          ? 'https://ipfs.io/ipfs/' + e.cid
                          : '',
                      animation_url:
                        fileType !== undefined &&
                        fileType.split('/')[0] !== 'image'
                          ? 'https://ipfs.io/ipfs/' + e.cid
                          : '',
                      type: fileType ? fileType.split('/')[0] : 'UNKNOWN',
                      showInput: true,
                      showMedia:
                        fileType !== undefined &&
                        fileType.split('/')[0] == 'image'
                          ? true
                          : false,
                      memeType:
                        fileType == 'application/zip'
                          ? 'application/zip'
                          : fileType,
                    });
                  }}
                />
                <br />

                {state.memeType !== undefined &&
                  state.memeType.split('/')[0] !== 'image' && (
                    <>
                      NFT COVER FOR VIDEO/AUDIO (NON IMAGE NFT)
                      <br />
                      <NFTInput
                        id={'nft-input-cover'}
                        label={'Cover:'}
                        accept={'image/*'}
                        onChange={async (e: any): Promise<void> => {
                          const {cid, fileType} = e;
                          setState({
                            ...state,
                            canMint:
                              fileType !== undefined &&
                              fileType.split('/')[0] == 'image'
                                ? true
                                : false,
                            fileData: 'https://ipfs.io/ipfs/' + cid,
                            disable: false,
                            memeType: fileType,
                            showMedia: true,
                          });
                        }}
                      />
                    </>
                  )}
              </div>
              {state.showMedia &&
                (state.fileData.length > 0 ||
                  state.animation_url.length > 0) && (
                  <>
                    <div className={'icon-wrapper mx-auto'}>
                      <img
                        className='h-100 w-auto'
                        src={state.fileData}
                        alt=''
                      />
                    </div>
                    <hr />
                  </>
                )}
            </div>

            <hr />
            {Object.keys(_metadata).map((data, key) => (
              <FormInputs
                show={data === 'image' || state.showInput}
                key={key}
                id={data}
                label={data.replace('_', ' ')}
                type={_metadataTypes[data + 'Type']}
                onChange={(e: any) => handleFormResponses(e, data)}
                style={`w-100`}
              />
            ))}
            {collectionInfo.type === 'ERC1155' && (
              <div className='d-flex flex-column'>
                Token Supply: {supply}
                <Input
                  id={'token-supply'}
                  label={'NFT Supply'}
                  type={'number'}
                  value={supply.toString()}
                  placeholder={supply.toString()}
                  inputStyle={''}
                  onChange={(e: any) => {
                    const {value} = e.target;
                    value !== undefined && parseInt(value) > 1000000000
                      ? setSupply(10000000000)
                      : value !== undefined && parseInt(value) < 0
                      ? setSupply(1)
                      : value == undefined || value == null || value == ''
                      ? setSupply(1)
                      : setSupply(parseInt(value.match(/\d+/gi).join('')));
                  }}
                />
                <hr />
              </div>
            )}
            <>
              Royalties: {royalties}%
              <Input
                id={'royalties'}
                label={'NFT Royalties'}
                type={'number'}
                value={royalties.toString()}
                placeholder={royalties.toString()}
                inputStyle={'w-100'}
                onChange={(e: any) => {
                  const {value} = e.target;
                  value !== undefined && parseInt(value) > 50
                    ? setRoyalties(50)
                    : value !== undefined && parseInt(value) < 0
                    ? setRoyalties(0)
                    : value == undefined || value == null || value == ''
                    ? setRoyalties(0)
                    : setRoyalties(parseInt(value.match(/\d+/gi).join('')));
                }}
              />
              <hr />
            </>
          </div>
          <div
            className={`col p-2 border border-dark d-inline-flex flex-column w-100 form-mx`}>
            <ToggleButton
              label={
                <>
                  <span className='mb-3'>
                    Enable Lazy Minting (Free Minting)
                    <br />
                    NFT Will Be Off-Chain Until Purchased or Transferred
                  </span>
                </>
              }
              getToggleStatus={(e) => {
                setLazyMint(e);
              }}
              defaultStatus={lazyMint}
            />
            <hr />
            <div className={`d-flex flex-column w-100`}>
              {
                <Button
                  disabled={false}
                  buttonStyle={`btn-dark`}
                  onClick={async () => {
                    await setState({...state, isLoading: true});
                    const json = JSON.stringify({
                      ..._metadata,
                      name: state.name,
                      description: state.description,
                      image: state.fileData,
                      animation_url: state.animation_url,
                      external_url: 'https://takolabs.io',
                      attributes: [
                        ...state.attributes,
                        {
                          trait_type: 'File Type',
                          value: state.type.toUpperCase(),
                        },
                        {
                          trait_type: 'Platform',
                          value: 'TAKO LABS',
                        },
                      ],
                      properties: state.properties,
                    });

                    await nft
                      .storeFileAsBlob(json)
                      .then((_tkn) => {
                        setState({
                          ...state,
                          token: _tkn,
                          disable: !state.disable,
                          isLoading: false,
                        });
                        return _tkn;
                      })
                      .then(async (cid) => {
                        const _nft = await TAKO.mint({
                          sdk,
                          collection: toUnionAddress(contractAddress),
                          data: {
                            uri: 'ipfs://ipfs/' + cid,
                            supply: supply,
                            lazyMint: lazyMint,
                            royalties: [
                              {
                                account:
                                  contractAddress.split(':')[0] +
                                  ':' +
                                  _address,
                                value: royalties * 100,
                              },
                            ],
                          },
                        }).catch((err) => {
                          console.log(err.message);
                        });
                        console.log(_nft);
                        setShow(false);
                      });
                  }}>
                  Mint
                </Button>
              }
            </div>

            {state.token.length > 0 && (
              <>
                <hr />
                <div className='d-flex flex-column justify-content-around'>
                  Your Metadata:{' '}
                  <a
                    target={'_blank'}
                    rel='norefferal'
                    className='text-truncate'
                    href={`https://ipfs.io/ipfs/${state.token}`}>
                    https://ipfs.io/ipfs/{state.token}
                  </a>
                </div>
              </>
            )}
            <hr />
            <p>
              Metadata powered by{' '}
              <a
                target={'_blank'}
                rel={'norefferal'}
                href={'https://nft.storage'}>
                NFT.Storage
              </a>
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
