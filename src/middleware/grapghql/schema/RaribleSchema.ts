export const RaribleTypes = `
  type NFTMetadataType {
    id: String
    tokenId: String
    collection: String
    url: String
    name: String
    description: String
    price: String
    blockchain: String
    creators: [Creators]
    lazySupply: String
    supply: String
    mintedAt: String
    sellers:Int
    bestSellOrder:Sell_Order
  }

  type NFTOrderDataType{
    id: String
    platform: String
    status: String
    makeStock: String
    createdAt: String
    makePrice: String
    makePriceUsd: String
    maker: String
    make: MakeDataType
    supply: String
  }

  type MakeDataType{
    type:Type
    value: String
  }
  type Type{
      type: String
      contract: String
      tokenId: String
    }
  type Collection_Data{
    nfts: [NFTMetadataType]
    totalSupply: Int
    orders: [NFTOrderDataType]
    continuation: String
  }
  type Creators {
    address: String!
    value: Int!
  }

  type Sell_Order{
    id: String
    platform: String
    fill: String
    status: String
  }

`;
export const AuthInputs = `
  input RaribleInput {
    address: String
    blockChain: String
    size: Int
    continuation: String
    start_date: String
  }

`;

export const RaribleQueries = `
get_nfts_from_contract_address(input: RaribleInput): Collection_Data
get_all_items(input: RaribleInput): Collection_Data
get_items_by_owner(input: RaribleInput): Collection_Data
get_item_by_nft_id(input: RaribleInput): NFTMetadataType
get_orders_by_nft_id(input: RaribleInput): [NFTOrderDataType]
get_bids_by_nft_id(input: RaribleInput): [NFTOrderDataType]
`;

export const AuthMutations = `

`;
