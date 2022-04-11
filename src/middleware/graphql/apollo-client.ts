// ./apollo-client.js
// @ts-ignore
import {ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client';
///
const httpLink = new HttpLink({uri: '/api/graphql'});

var client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache(),
});

export default client;
