let db: any;
// @ts-ignore
import typeDefs from '../../src/middleware/graphql/schema/index.ts';
// @ts-ignore
import resolvers from '../../src/middleware/graphql/resolvers.ts';
// @ts-ignore
import {ApolloServer} from 'apollo-server-micro';
const _config: any = {
  typeDefs,
  resolvers,
  async context({req, res}) {
    return {req, res};
  },
};
console.log('_config', _config);
const apolloServer = new ApolloServer(_config);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async () => {
  await apolloServer.start();
  return await apolloServer.createHandler({path: '/api/graphql'});
};
export default handler;
