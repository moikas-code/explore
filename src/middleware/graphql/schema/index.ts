import {gql} from 'apollo-server-micro';
import {
  // RaribleTypes,
  AuthInputs,
  RaribleQueries,
  AuthMutations,
} from './schema';

const typeDefs = gql`
  input queryInput {
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
    getCollectionsByOwner(input: queryInput): [Collection_Data]
  }
`;
// ${RaribleQueries}

export default typeDefs;
