import {ReactNode, useEffect, useState} from 'react';
import NFTInput from './NFTInput';
import Button from './common/button';
import {connect} from 'react-redux';
import Select from 'react-select';
// @ts-ignore
import {_metadata, _metadataTypes} from '../lib/metadataSchema.ts';
import {event} from '../utility/analytics';
import FormInputs from './FormInputs';

import nft from '../lib/nft-storage';
import MediaViewer from './media-viewer';
import {FormProps} from '../common/form-props';
import {MintRequest} from '@rarible/sdk/build/types/nft/mint/mint-request.type';
import {PrepareMintResponse} from '@rarible/sdk/build/types/nft/mint/domain';
import {
  toUnionAddress,
  UnionAddress,
  BigNumber,
  toBigNumber,
} from '@rarible/types';
import {Input} from '../common/input';
import AKKORO_LIB from '../akkoro_lib';
import {createRaribleSdk} from '@rarible/sdk';
// import {BigNumber} from 'ethers';

type MintFormProps = FormProps<MintRequest> & {
  response: PrepareMintResponse;
};
interface NFTFormProps extends MintFormProps {
  address: UnionAddress;
  connection: any;
  sdk: any;
  wallerAddress: any;
  blockchain: any;
}

function Toggle_Button({
  label,
  getToggleStatus,
  defaultStatus = false,
}: {
  label?: string | ReactNode;
  getToggleStatus: (e: any) => boolean;
  defaultStatus?: boolean;
}) {
  const [selected, toggleSelected] = useState<boolean>(defaultStatus);

  useEffect(() => {
    getToggleStatus(selected);
  }, [selected]);
  return (
    <>
      <style jsx>{`
        .toggle-container {
          width: 70px;
          background-color: #c4c4c4;
          cursor: pointer;
          user-select: none;
          border-radius: 3px;
          padding: 2px;
          height: 32px;
          position: relative;
        }

        .dialog-button {
          font-size: 14px;
          line-height: 16px;
          font-weight: bold;
          cursor: pointer;
          background-color: #002b49;
          color: white;
          padding: 8px 12px;
          border-radius: 18px;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          min-width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 38px;
          min-width: unset;
          border-radius: 3px;
          box-sizing: border-box;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
          position: absolute;
          top: 0;
          left: 34px;
          transition: all 0.3s ease;
        }

        .disabled {
          background-color: #707070;
          left: 0px;
        }
      `}</style>
      <div className='d-flex flex-column justify-content-center align-items-start'>
        <p className='mb-0 me-2'>{label}</p>

        <div
          className='toggle-container  mx-2'
          onClick={() => {
            toggleSelected(!selected);
          }}>
          <div className={`dialog-button h-100 ${selected ? '' : 'disabled'}`}>
            {selected ? '✔' : '❌'}
          </div>
        </div>
      </div>
    </>
  );
}

function NFTForm({
  address,
  connection,
  blockchain,
  onSubmit,
  response,
}: NFTFormProps) {
  const [collection, setCollectionAddress] = useState<UnionAddress>(
    'ETHEREUM:0xb6837da7da62faedd38257658b240cfa123ef601' as UnionAddress
  );
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
  useEffect(() => {
    
    console.log(sdk);
    process.env.AKKORO_ENV == 'prod' &&
      setCollectionAddress(
        toUnionAddress('ETHEREUM:0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8')
      );
    AKKORO_LIB.getCurrencyOptions(connection.blockchain).then((options) => {
      console.log(options);
      setCurrency(
        blockchain == 'ETHEREUM'
          ? {
              value: {id: '1', '@type': 'ETH'},
              label: 'ETH',
            }
          : options[0]
      );
      setCurrencyOptions(
        connection.blockchain == 'ETHEREUM'
          ? [
              {
                value: {id: '1', '@type': 'ETH'},
                label: 'ETH',
              },
              ...options,
            ]
          : options
      );
    });
    switch (connection.blockchain) {
      case 'ETHEREUM':
        process.env.AKKORO_ENV == 'prod' &&
          setCollectionAddress(
            toUnionAddress(
              'ETHEREUM:0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8'
            )
          );
        break;
      case 'TEZOS':
        process.env.AKKORO_ENV == 'prod'
          ? setCollectionAddress(
              toUnionAddress('TEZOS:KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS')
            )
          : setCollectionAddress(
              toUnionAddress('TEZOS:KT1BMB8m1QKqbbDDZPXpmGVCaM1cGcpTQSrw')
            );
      case 'FLOW':
        process.env.AKKORO_ENV == 'prod'
          ? setCollectionAddress('FLOW:A.01ab36aaf654a13e.RaribleNFT')
          : setCollectionAddress('FLOW:A.ebf4ae01d1284af8.RaribleNFT');
      default:
        break;
    }
  }, []);
  const error = validate(state.token, supply, response);
  return (
    <>
      <style global jsx>
        {`
          .nft-mint-form {
            overflow-y: scroll;
          }
          .form-mx {
            max-width: 800px;
          }
          input {
            width: 100% !important;
          }
          .file-widget {
            max-width: 18.75rem;
            max-width: 37.5rem;
          }
          .royalty-btn {
            min-width: 4.6875rem;
            margin: 0.5rem;
          }
          .nft-img-preview img {
            object-fit: contain;
          }
          .nft-img-preview img,
          .nft-video-preview video {
            max-height: 300px;
          }
          .loader {
            position: fixed; /* Sit on top of the page content */
            top: 0;
            left: 0;
            background-color: grey;
            z-index: 100; /* Specify a stack order in case you're using a different order for other elements */
            cursor: pointer; /* Add a pointer on hover */
            opacity: 50%;
          }
          .loader div {
            opacity: 100%;
          }
        `}
      </style>
      <div
        className={
          'nft-mint-form d-flex flex-column m-1 pb-5 mx-auto container-fluid h-100 w-100'
        }>
        <div className='rounded overflow-md-scroll d-flex flex-column justify-content-between align-items-center p-1 h-100 w-100'>
          <div className='d-flex  flex-column  flex-wrap justify-content-around align-items-center mx-2 w-100'>
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
                      const {cid, fileType} = e;
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
                          e.fileType == 'application/zip'
                            ? 'application/zip'
                            : e.fileType,
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
                      <div className={'nft-img-preview mx-auto w-auto'}>
                        <MediaViewer
                          mimeType={state.memeType}
                          displayUri={
                            state.memeType !== undefined &&
                            state.memeType.split('/')[0] !== 'image'
                              ? state.animation_url
                              : state.fileData
                          }
                          artifactUri={
                            state.memeType !== undefined &&
                            state.memeType.split('/')[0] !== 'image'
                              ? state.animation_url
                              : state.fileData
                          }
                          type={'ipfs'}
                          onLoad={(e: any): void => {
                            console.log('loaded');
                          }}
                        />
                      </div>
                      <hr />
                    </>
                  )}
              </div>

              <hr />
              <Toggle_Button
                label='List on Rarible Protocol'
                getToggleStatus={(e) => {
                  setSell_Toggle(e);
                }}
                defaultStatus={sell_toggle}
              />
              {sell_toggle && (
                <>
                  <hr className='text-white border-bottom border-white w-100 mx-auto px-3 text-center' />
                  <div className={`d-flex flex-column w-100`}>
                    <>
                      Price:
                      <div className='d-flex flex-row align-items-center'>
                        <Input
                          type='number'
                          value={sell_price}
                          placeholder='Price'
                          onChange={(e) => {
                            e !== undefined && parseFloat(e) > 200000
                              ? setSell_Price(200000)
                              : e !== undefined && parseFloat(e) < 0.0
                              ? setSell_Price(0)
                              : e == undefined || e == null || e == ''
                              ? setSell_Price(0)
                              : setSell_Price(e);
                          }}
                        />
                        {/* Dropdown */}
                        <Select
                          className='text-black mb-0 me-3 ms-5 h-100 w-100'
                          label=''
                          options={currencyOptions}
                          value={currency}
                          onChange={(e) => {
                            setCurrency(e);
                            console.log(e);
                          }}
                        />
                        {console.log(currency)}
                        {/* <p className='mb-0 me-3 ms-5'>ETH</p> */}
                      </div>
                      Service Fee 1% You Recieve:{' '}
                      {(sell_price - sell_price * 0.01).toFixed(18)} ETH
                    </>
                  </div>
                </>
              )}
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
                    e !== undefined && parseInt(e) > 1000000000
                      ? setSupply(10000000000)
                      : e !== undefined && parseInt(e) < 0
                      ? setSupply(1)
                      : e == undefined || e == null || e == ''
                      ? setSupply(1)
                      : setSupply(parseInt(e.match(/\d+/gi).join('')));
                  }}
                />
                <hr />
              </div>
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
                    e !== undefined && parseInt(e) > 50
                      ? setRoyalties(50)
                      : e !== undefined && parseInt(e) < 0
                      ? setRoyalties(0)
                      : e == undefined || e == null || e == ''
                      ? setRoyalties(0)
                      : setRoyalties(parseInt(e.match(/\d+/gi).join('')));
                  }}
                />
                <hr />
              </>
            </div>
            <div
              className={`col p-2 border border-dark d-inline-flex flex-column w-100 form-mx`}>
              <Toggle_Button
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
                    disabled={!state.canMint || state.name.length <= 0}
                    buttonStyle={`btn-dark`}
                    onPress={async () => {
                      var sdk = createRaribleSdk(connection, 'prod');
                      await setState({...state, isLoading: true});
                      const json = JSON.stringify({
                        ..._metadata,
                        name: state.name,
                        description: state.description,
                        image: state.fileData,
                        animation_url: state.animation_url,
                        external_url: 'https://akkoros.xyz',
                        attributes: [
                          ...state.attributes,
                          {
                            trait_type: 'File Type',
                            value: state.type.toUpperCase(),
                          },
                          {
                            trait_type: 'Platform',
                            value: 'Akkoros',
                          },
                        ],
                        properties: state.properties,
                      });

                      sell_toggle
                        ? await nft
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
                              const nft = await AKKORO_LIB.mint({
                                sdk: sdk,
                                collection: toUnionAddress(collection),
                                data: {
                                  uri: 'ipfs://ipfs/' + cid,
                                  supply: supply,
                                  lazyMint: lazyMint,
                                  royalties: [
                                    {
                                      account:
                                        connection.blockchain + ':' + address,
                                      value: royalties * 100,
                                    },
                                  ],
                                },
                              }).catch((err) => {
                                console.log(err.message);
                              });
                              console.log('NFT DATA:',nft,sdk);
                              return nft.itemId;
                            })
                            .then(async (tk_id) => {
                              await AKKORO_LIB.sell_nft({
                                sdk,
                                amount: toBigNumber(supply.toString()),
                                currency: currency.value,
                                nft_id: tk_id,
                                price: parseFloat(sell_price.toString()),
                                blockchain: connection.blockchain,
                              }).catch((err) => {
                                console.log(err.message);
                              });
                            })
                            .then(() =>
                              event({
                                action:
                                  'mint_and_sell_' +
                                  connection.blockchain +
                                  '_nft',
                                params: {
                                  event_category: 'mint',
                                  event_label: 'mint',
                                },
                              })
                            )
                        : await nft
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
                              const nft = await AKKORO_LIB.mint({
                                sdk,
                                collection: toUnionAddress(collection),
                                data: {
                                  uri: 'ipfs://ipfs/' + cid,
                                  supply: supply,
                                  lazyMint: lazyMint,
                                  royalties: [
                                    {
                                      account:
                                        connection.blockchain + ':' + address,
                                      value: royalties * 100,
                                    },
                                  ],
                                },
                              }).catch((err) => {
                                console.log(err.message);
                              });
                              console.log(nft);
                              return nft.itemId;
                            })
                            .then(() =>
                              event({
                                action: 'mint' + connection.blockchain + 'nft',
                                params: {
                                  event_category: 'mint',
                                  event_label: 'mint',
                                },
                              })
                            );
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
          </div>
        </div>
      </div>
      {state.isLoading && (
        <div
          className={`w-100 h-100 loader d-flex flex-column justify-content-center align-items-center`}>
          <div className='mx-auto text-uppercase mb-3'>
            Minting NFT
            <hr />
          </div>
          <div className='spinner-border mx-auto' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
const mapStateToProps = (state) => ({
  address: state.session.address,
  connection: state.session.connection,
  blockchain: state.session.blockchain,
});
export default connect(mapStateToProps)(NFTForm);

function validate(uri: string, supply: any, prepareResponse: any) {
  const a = parseInt(supply);
  if (isNaN(a)) {
    return 'supply can not be parsed';
  }
  return undefined;
}
