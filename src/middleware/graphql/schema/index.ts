import {gql} from 'apollo-server-micro';

const typeDefs = gql`
  input QueryInput {
    address: String
    blockChain: String
    size: Int
    continuation: String
    start_date: String
  }

  type Collection_Data {
    nfts: [NFTMetadataType]
    totalSupply: Int
    orders: [NFTOrderDataType]
    continuation: String
  }

  type COLLECTION_OBJ {
    total:Int
    continuation: String
    collections: [COLLECTION]
  }

  type COLLECTION {
    id: String!
    parent: String
    blockchain: String!
    type: String!
    name: String!
    symbol: String
    owner: String
    features: [String]
    minters: [String]
    meta: COLLECTION_META
  }

  type COLLECTION_META {
    name: String!
    description: String
    content: [META_CONTENT]
    externalLink: String
    sellerFeeBasisPoints: Int
    feeRecipient: String
  }

  type META_CONTENT {
    width: Int
    height: Int
    url: String
    representation: String
    mimeType: String
    size: Int
  }

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
    sellers: Int
    bestSellOrder: Sell_Order
  }

  type NFTOrderDataType {
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

  type MakeDataType {
    type: DataType
    value: String
  }
  type DataType {
    type: String
    contract: String
    tokenId: String
  }

  type Creators {
    address: String!
    value: Int!
  }

  type Sell_Order {
    id: String
    platform: String
    fill: String
    status: String
  }

  type Query {
    Owned_Collections(input: QueryInput): COLLECTION_OBJ
  }
`;

export default typeDefs;
