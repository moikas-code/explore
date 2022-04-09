// ./apollo-client.js
// @ts-ignore
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
///
let appJWTToken;
const httpLink = new HttpLink({ uri: process.env.AKKORO_ENV !=='prod'?'/api/graphql':'https://takolabs.io/api/graphql' });
const authMiddleware = new ApolloLink((operation, forward) => {
  if (appJWTToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${appJWTToken}`,
      },
    });
  }
  return forward(operation);
});

var client = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
