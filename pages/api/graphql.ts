// @ts-ignore
import typeDefs from '../../src/middleware/grapghql/schema';
// @ts-ignore
import resolvers from '../../src/middleware/grapghql/resolvers';
// @ts-ignore
import {ApolloServer} from 'apollo-server-micro';
// import database from '../../middleware/database/';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  async context({req, res}) {
    return {req, res};
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default  apolloServer.createHandler({path: '/api/graphql'});
