import TAKO from '../../tako';
const resolvers = {
  Query: {
    Owned_Collections: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      const {blockChain, address, continuation, size} = args.input;
      
      return await TAKO.getCollectionsByOwner({
        blockChain,
        address,
        continuation,
        size,
      });
    },
  },
};
export default resolvers;
//   get_all_items: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_all_items(args.input);
//   },
//   get_item_by_nft_id: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_item_by_nft_id(args.input.address);
//   },
//   get_orders_by_nft_id: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     console.log(args.input);
//     return await AKKORO_LIB.get_orders_by_nft_id(args.input.address);
//   },
//   get_bids_by_nft_id: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_bids_by_nft_id(args.input.address);
//   },
//   get_items_by_owner: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_items_by_owner(args.input.address);
//   },
//   get_nfts_from_contract_address: async (
//     parent: object,
//     args: any,
//     _context: any,
//     info: object
//   ) => {
//     return await AKKORO_LIB.get_nfts_from_contract_address(
//       args.input.address
//     );
//   },
// },
// Mutation: {
//TODO: MOVE TO OWN FILE
// createAuth: async (
//   parent: object,
//   args: any,
//   _context: any,
//   info: object
// ) => await createAuth(parent, args, _context, info),
// updateAuth: async (
//   parent: object,
//   args: any,
//   _context: any,
//   info: object

// ) => await updateAuth(parent, args, _context, info),
