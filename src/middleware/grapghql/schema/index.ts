// @ts-ignore
import {gql} from 'apollo-server-micro';
import {
  RaribleTypes,
  AuthInputs,
  RaribleQueries,
  AuthMutations,
} from './RaribleSchema';

const typeDefs = gql`
  ${RaribleTypes}
  ${AuthInputs}

  type Query {
    ${RaribleQueries}
  }

`;

export default typeDefs;
