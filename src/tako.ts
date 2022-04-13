import axios from 'axios';

var name = 'akkoro_Lib';
var version = '0.0.1';
var baseURL = 'https://api.rarible.org/';
var dev_baseURL = 'https://api-dev.rarible.org/';
var validate = 'v0.1/signature/validate';
var items = 'v0.1/items';
var ownerships = 'v0.1/ownerships';
var collections = 'v0.1/collections';

function cleanUrl(needle: string, arrhaystack: string[]) {
  const haystack = arrhaystack
    .map((item) => {
      const regex = new RegExp(item, 'g'); // correct way
      if (needle.split(item).length > 0) {
        if (needle.split('ipfs/')[0] == 'https://rarible.mypinata.cloud/') {
          return needle;
        } else if (needle.split('ipfs/')[0] == item) {
          return needle.replace(regex, 'https://akkoros.mypinata.cloud/ipfs/');
        } else if (needle.indexOf('ipfs://') > -1) {
          return needle.replace(
            'ipfs://',
            'https://akkoros.mypinata.cloud/ipfs/'
          );
        }

        return needle;
      }
    })
    .filter(function (val) {
      return val !== null && val !== undefined && val !== '';
    });

  return haystack.length > 0 ? haystack[0] : needle;
}

const TAKO = {
  // FIlters
  filterByProperty(array: any[], propertyName: string): any[] {
    var occurrences: any = {};

    return array.filter(function (x) {
      var property = x[propertyName];
      if (occurrences[property]) {
        return false;
      }
      occurrences[property] = true;
      return true;
    });
  },
  // QUERYIES
  getCurrencyOptions: async (blockchain: string) => {
    switch (blockchain) {
      case 'ETHEREUM':
        return [
          {
            value: {
              '@type': 'ERC20',
              contract: 'ETHEREUM:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            },
            label: 'WETH',
          },
        ];
      case 'TEZOS':
        return [
          {
            value: {
              '@type': 'NATIVE',
            },
            label: 'XTZ',
          },
        ];
      case 'FLOW':
        return [
          {
            value: {
              '@type': 'NATIVE',
            },
            label: 'FLOW',
          },
        ];
      default:
        break;
    }
  },
  //

  getCollectionsByOwner: async ({
    blockChain,
    address,
    continuation = '',
    size = 10,
  }: {
    blockChain: string;
    address: string;
    continuation: string;
    size: number;
  }) => {
    try {
      var _blockchain = blockChain;
      // base url
      const base = !process.env.DEV === true ? baseURL : dev_baseURL;
      // api url
      if (typeof blockChain === 'undefined') {
        throw new Error('blockChain is undefined');
      }
      if (typeof address === 'undefined') {
        throw new Error('blockChain is undefined');
      }
      if (blockChain === 'POLYGON') {
        _blockchain = 'ETHEREUM';
      }
      //fetch
      return await fetch(
        `${base}${collections}/byOwner/?blockchains=${blockChain}&owner=${_blockchain}:${address}&${continuation}&${size}` as string,
        {
          method: 'GET',
        }
      ).then(async (res) => res.json());
    } catch (error) {}
  },
  get_collectionByAddress: async ({sdk, address}: {sdk: any; address: any}) => {
    return await sdk?.apis.collection.getCollectionById({
      collection: address,
      // 'ETHEREUM:0xF6793dA657495ffeFF9Ee6350824910Abc21356C'
    });
  },
  get_all_collections: async ({sdk}: {sdk: any}) => {
    return await sdk.apis.collection.getAllCollections({});
  },

  get_ownership_status: async (address: any, nft_id: any) => {
    return await TAKO.get_ownership_by_nft_id(nft_id).then(
      async ({ownerships, total}) => {
        const items_owned = await ownerships.filter(({owner}: {owner: any}) => {
          // console.log(_owner);
          return owner == address;
        });
        return items_owned.length > 0 ? true : false;
      }
    );
  },

  get_ownership_by_nft_id: async (address: any) => {
    // console.log(address);
    const url = ((!process.env.DEV ? baseURL : dev_baseURL) +
      ownerships +
      '/byItem' +
      `?itemId=${address}`) as string;

    return await fetch(url, {
      method: 'GET',
    }).then((res) => res.json());
  },
  get_bids_by_nft_id: async (address: any) => {
    // console.log(address);
    const url =
      (!process.env.DEV ? baseURL : dev_baseURL) +
      'v0.1/orders/bids/byItem/' +
      `?itemId=${address}&status=ACTIVE`;
    console.log(url);
    let data = await fetch(url, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) =>
        res.orders.map(async (item: any) => {
          // console.log(item);
          const asArray = Object.entries(item);
          const filtered = asArray.filter(([key, value]) =>
            [
              'platform',
              'fill',
              'id',
              'status',
              'makeStock',
              'createdAt',
              'makePrice',
              'makePriceUsd',
              'maker',
            ].includes(key)
          );

          // const filtered2 = asubArray.filter(([key, value]) =>
          //   [''].includes(key)
          // );

          const filteredObj1 = Object.fromEntries(filtered);
          // const filteredObj2 = Object.fromEntries(filtered2);
          // const content = await item.meta.content;
          return await {
            ...(await filteredObj1),
            // ...filteredObj2,
          };
        })
      );

    // console.log('clean', data);
    return await data;
  },
  get_orders_by_nft_id: async (address: any) => {
    // console.log('address', address);
    const url =
      baseURL +
      'v0.1/orders/sell' +
      '/byItem' +
      `?platform=RARIBLE&itemId=${address}`;
    console.log(url);
    let data = await fetch(url, {
      method: 'GET',
    })
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((res) =>
        res.orders.map(async (item: any) => {
          // console.log(item);
          const asArray = Object.entries(item);
          const filtered = asArray.filter(([key, value]) =>
            [
              'platform',
              'fill',
              'id',
              'status',
              'makeStock',
              'createdAt',
              'makePrice',
              'makePriceUsd',
              'maker',
            ].includes(key)
          );

          // const filtered2 = asubArray.filter(([key, value]) =>
          //   [''].includes(key)
          // );

          const filteredObj1 = Object.fromEntries(filtered);
          // const filteredObj2 = Object.fromEntries(filtered2);
          // const content = await item.meta.content;
          // console.log(item.make);
          return await {
            ...(await filteredObj1),
            // ...filteredObj2,
            make: {
              type: {
                type: item.make.type['@type'],

                contract: item.make.type.contract,
                tokenId: item.make.type.tokenId,
              },
              value: item.make.value,
            },
          };
        })
      );
    // console.log('clean', data);
    // console.log('clean', clean);
    return await data;
  },
  get_nfts_from_contract_address: async (
    address: any = 'ETHEREUM:0x277E4e7AA71d33f235a3A6b9aC95f79080f4D3db'
  ) => {
    const url = ((!process.env.DEV ? baseURL : dev_baseURL) +
      items +
      '/byCollection/' +
      `?collection=${address}`) as string;
    let data = await fetch(url, {
      method: 'GET',
    }).then((res) => res.json());

    return {
      totalSupply: data.total,
      nfts: data.items.map(async (item: any) => {
        const asArray = Object.entries(item);
        const asubArray = Object.entries(item?.meta);
        const filtered = asArray.filter(([key, value]) =>
          ['tokenId', 'blockchain', 'id'].includes(key)
        );

        const filtered2 = asubArray.filter(([key, value]) =>
          ['name'].includes(key)
        );

        const filteredObj1 = Object.fromEntries(filtered);
        const filteredObj2 = Object.fromEntries(filtered2);
        const content = await item.meta.content;
        return {
          ...filteredObj1,
          ...filteredObj2,
          url: content[0] !== undefined ? content[0].url : '',
        };
      }),
    };
  },
  get_all_items: async ({
    blockChain,
    size,
    continuation,
    start_date,
  }: {
    blockChain: string;
    size: number;
    continuation: any;
    start_date: number;
  }) => {
    try {
      // base url
      const base = process.env.DEV !== 'true' ? baseURL : dev_baseURL;
      // api url
      let url = `${base}${items}/all/?size=${size}&continuation=${continuation}&lastUpdatedFrom=${JSON.stringify(
        Date.now() - 86400000 * 3
      )}` as string;
      //fetch
      let data = await fetch(url, {
        method: 'GET',
      }).then(async (res) => res.json());
      // nft_list
      const nft_list = await data.items.map(async (item: any) => {
        const asArray = Object.entries(item);
        const asubArray = Object.entries(item?.meta);
        const filtered = asArray.filter(([key, value]) =>
          ['tokenId', 'blockchain', 'id', 'bestSellOrder', 'supply'].includes(
            key
          )
        );
        const filtered2 = asubArray.filter(([key, value]) =>
          ['name', 'description'].includes(key)
        );

        const filteredObj1 = Object.fromEntries(filtered);
        const filteredObj2 = Object.fromEntries(filtered2);
        const content = await item.meta.content;
        return await {
          ...filteredObj1,
          ...filteredObj2,
          url:
            content[0] !== undefined
              ? cleanUrl(content[0].url, ['ipfs://', 'https://ipfs.io/ipfs/'])
              : '',
          creators: await item?.creators.map(({account}: any) => {
            return {address: account};
          }),
        };
      });
      //nft_query
      const nft_query = {
        totalSupply: data.total,
        continuation: data.continuation,
        nfts: await nft_list,
      };
      return nft_query;
    } catch (error) {
      console.log(error);
    }
  },
  get_items_by_owner: async (address: any) => {
    try {
      const base = process.env.DEV !== 'true' ? baseURL : dev_baseURL;
      let url = (base + items + '/byOwner/' + `?owner=${address}`) as string;
      console.log(process.env.DEV, url);
      let data = await fetch(url, {
        method: 'GET',
      }).then(async (res) => res.json());
      return {
        totalSupply: data.total,
        nfts: data.items.map(async (item: any) => {
          const asArray = Object.entries(item);
          const asubArray = Object.entries(item?.meta);
          const filtered = asArray.filter(([key, value]) =>
            ['tokenId', 'blockchain', 'id', 'bestSellOrder', 'supply'].includes(
              key
            )
          );
          const filtered2 = asubArray.filter(([key, value]) =>
            ['name'].includes(key)
          );
          const filteredObj1 = Object.fromEntries(filtered);
          const filteredObj2 = Object.fromEntries(filtered2);
          const content = await item.meta.content;

          return {
            ...filteredObj1,
            ...filteredObj2,
            url: content[0] !== undefined ? content[0].url : '',
          };
        }),
      };
    } catch (error) {
      console.log(error);
    }
  },
  get_item_by_nft_id: async (nft_id: any) => {
    try {
      let url = baseURL + items + '/' + `${nft_id}`;
      console.log(url);
      let data = await fetch(url, {
        method: 'GET',
      })
        .then(async (res) => res.json())
        .then(async (data: any) => {
          const asArray = Object.entries(data);
          const asubArray = Object.entries(data?.meta);
          const filtered = asArray.filter(([key, value]) =>
            ['tokenId', 'blockchain', 'id', 'supply'].includes(key)
          );
          const filtered2 = asubArray.filter(([key, value]) =>
            ['name'].includes(key)
          );
          const filteredObj1 = Object.fromEntries(filtered);
          const filteredObj2 = Object.fromEntries(filtered2);
          const content = await data.meta.content;
          console.log(content[0].url);
          return {
            ...filteredObj1,
            ...filteredObj2,
            url:
              content[0] !== undefined
                ? cleanUrl(content[0].url, ['ipfs://', 'https://ipfs.io/ipfs/'])
                : '',
            bestSellOrder: {
              ...data.bestSellOrder,
            },
          };
        });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  get_nfts_by_collection: async ({
    sdk,
    collection,
  }: {
    sdk: any;
    collection: any;
  }) => {
    // if (!sdk) return;
    // console.log(collection);
    return await sdk.apis.item.getItemsByCollection({collection});
  },
  get_nft_data: async ({sdk, collection}: {sdk: any; collection: any}) => {
    if (!sdk) return;
    return await sdk.nft.mint({collection: collection});
  },
  // MUTATIONS
  createCollection: async (sdk, collectionRequest) => {
    try {
      if (!sdk) return;
      console.log(sdk);
      const result = await sdk.nft.createCollection(collectionRequest);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  mint: async ({
    sdk,
    collection,
    data,
  }: {
    sdk: any;
    collection: any;
    data: any;
  }) => {
    // console.log(sdk, collection, data);
    if (!sdk) return;
    return await TAKO.get_collectionByAddress({
      sdk,
      address: collection,
    })
      .then(
        async (_collection) =>
          await TAKO.get_nft_data({
            sdk,
            collection: _collection,
          })
      )
      .then(async ({submit}: any) => {
        const nft_data = await submit(data);
        return nft_data;
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  sell_nft: async ({
    sdk,
    nft_id,
    amount,
    price,
    blockchain,
    currency,
  }: {
    sdk: any;
    nft_id: any;
    amount: any;
    price: number;
    blockchain: string;
    currency: any;
  }) => {
    // console.log(sdk, nft_id, amount, price, blockchain, currency);
    const {
      supportedCurrencies, // list of currency types supported by the blockchain (ETH, ERC20 etc.)
      maxAmount, // max amount of the NFT that can be put on sale
      baseFee, // present it to a user, it's a base protocol fee that is taken on the trade
      submit, // use this Action to submit information after user input
    } = await sdk.order.sell({itemId: nft_id});
    // if (amount <= maxAmount) {
    // console.log(supportedCurrencies);
    const orderId = await submit({
      amount,
      price: parseFloat(price.toString()),
      currency: currency,
      originFees:
        blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x3E874472Da434f8E1252E95430a65e8F516ED00d' as any,
                value: 100,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1Q5duBxjCNy1c5Kba63Mf5Jqz9wyKqXFAk' as any,
                value: 100,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 100,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
  },
  bid_nft: async ({
    sdk,
    nft_id,
    amount,
    price,
    blockchain,
    currency,
  }: {
    sdk: any;
    nft_id: any;
    amount: any;
    price: number;
    blockchain: string;
    currency: any;
  }) => {
    console.log(sdk, nft_id, amount, price, blockchain);
    const {
      supportedCurrencies, // list of currency types supported by the blockchain (ETH, ERC20 etc.)
      maxAmount, // max amount of the NFT that can be put on sale
      baseFee, // present it to a user, it's a base protocol fee that is taken on the trade
      submit, // use this Action to submit information after user input
    } = await sdk.order.bid({itemId: nft_id});
    // if (amount <= maxAmount) {
    const orderId = await submit({
      amount,
      price: price,
      currency: currency,
      originFees:
        blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x3E874472Da434f8E1252E95430a65e8F516ED00d' as any,
                value: 100,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1Q5duBxjCNy1c5Kba63Mf5Jqz9wyKqXFAk' as any,
                value: 100,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 100,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
  },
  buy_nft: async ({
    sdk,
    order_id,
    amount,
    blockchain,
  }: {
    sdk: any;
    order_id: any;
    amount: any;
    blockchain: string;
  }) => {
    const {
      maxAmount, // max amount of NFTs available for purchase
      baseFee, // fee that will be taken from the buyer
      originFeeSupport, // if smart contract supports custom origin fees
      payoutsSupport, // if smart contract supports payouts
      supportsPartialFill, // if smart contract supports partial fills
      submit, // use this Action to submit information after user input
    } = await sdk.order.buy({orderId: order_id});
    // if (amount <= maxAmount) {
    const orderId = await submit({
      amount,
      currency: {'@type': 'ETH'},
      originFees:
        blockchain == 'ETHEREUM'
          ? [
              {
                account: 'ETHEREUM:0x3E874472Da434f8E1252E95430a65e8F516ED00d' as any,
                value: 100,
              },
            ]
          : blockchain == 'TEZOS'
          ? [
              {
                account: 'TEZOS:tz1Q5duBxjCNy1c5Kba63Mf5Jqz9wyKqXFAk' as any,
                value: 100,
              },
            ]
          : blockchain == ' FLOW'
          ? [
              {
                account: 'FLOW:0x54607bd2c9da71d0' as any,
                value: 100,
              },
            ]
          : [],
    });
    await console.log(orderId);
    // }
  },
};

export default (() => {
  if (typeof window === 'undefined') require('dotenv').config();
  // console.log(window);
  return TAKO;
})();
