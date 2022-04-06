import React, {useState, useEffect} from 'react';
import {gql, useQuery, useLazyQuery} from '@apollo/client';
import {truncateAddress} from '../lib/moiWeb3';
import {
  ItemId,
  BigNumber,
  toUnionAddress,
  OrderId,
  toBigNumber,
  ContractAddress,
} from '@rarible/types';
import AKKORO_LIB from '../akkoro_lib';
import Button from '../components/common/button';
import {createRaribleSdk} from '@rarible/sdk';
import {connect} from 'react-redux';
function OrderItems({
  nid = '',
  address = '',
  blockchain = '',
  connection,
}: {
  // sdk: IRaribleSdk;
  nid: string;
  address: string;
  blockchain: string;
  connection: any;
}) {
  const [orderData, setOrderData] = React.useState([]);
  const [completed, setCompleted] = React.useState(false);
  const query = gql`
    query NFT_ORDER_DATA($input: RaribleInput) {
      get_orders_by_nft_id(input: $input) {
        id
        platform
        status
        makeStock
        createdAt
        makePrice
        makePriceUsd
        maker
        make {
          type {
            type
            contract
            tokenId
          }
          value
        }
      }
    }
  `;

  const {loading, error, data} = useQuery(query, {
    variables: {
      input: {
        address: nid.toString(),
      },
    },
    onCompleted: (data) => {
      console.log(
        data.get_orders_by_nft_id.filter((order) => order.status == 'ACTIVE')
      );
      setOrderData(
        data.get_orders_by_nft_id.filter((order) => order.status == 'ACTIVE')
      );
      setCompleted(true);
    },
  });
  if (loading)
    return (
      <div className='d-flex flex-column justify-content-center align-items-center w-100 h-100'>
        <p>Loading Orders...</p>
        <br />
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );

  if (completed) {
    return (
      <>
        {console.log(data)}
        <style global jsx>{`
          .order-content-wrapper {
            min-height: 380px;
          }
          .order-content {
            overflow-y: scroll;
          }
        `}</style>
        <div className='order-content-wrapper d-flex flex-column justify-content-start align-items-center w-100 h-100'>
          <hr className='text-white border-bottom border-white w-100 mx-auto px-3 text-center' />
          <h6 className='text-left'>Orders:</h6>
          <div className='order-content d-flex flex-column justify-content-start align-items-start w-100 h-100  px-4'>
            {orderData.length > 0 ? (
              orderData.map((order, key) => {
                const id = order.id as OrderId;
                return (
                  <div
                    key={key}
                    className='d-flex flex-column justify-content-between align-items-start border border-white py-3 px-2 my-2 w-100 rounded pointer'>
                    <p className='mb-0 fs-6 px-2  '>
                      Author:{' '}
                      <span
                        title={order.maker.split(':')[1]}
                        className='mx-2 border-bottom'>
                        {truncateAddress(order.maker.split(':')[1])}
                      </span>
                    </p>{' '}
                    <div className='d-flex flex-column flex-sm-row flex-lg-column justify-content-sm-start'>
                      <p className='fs-6 px-2'>
                        {' '}
                        For Sell:{' '}
                        <span className='mx-2 border-bottom'>
                          {order.makeStock}
                        </span>
                      </p>
                    </div>
                    {order.maker !==
                      toUnionAddress(blockchain + ':' + address) && (
                      <Button
                        onPress={() =>
                          AKKORO_LIB.buy_nft({
                            sdk: createRaribleSdk(connection, 'prod'),
                            amount: '1' as BigNumber,
                            order_id: id as OrderId,
                            blockchain,
                          })
                        }
                        buttonStyle='btn btn-outline-success w-100'>
                        Buy 1 For
                        <span title='1% Service Fee' className='mx-1'>
                          {parseFloat(order.makePrice).toFixed(4)} {blockchain}{' '}
                          + 1%
                        </span>
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className='mx-auto'>No Orders Found</div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {console.log(data)}
      <style global jsx>{`
        .order-content-wrapper {
          min-height: 380px;
        }
        .order-content {
          overflow-y: scroll;
        }
      `}</style>
      <div className='order-content-wrapper d-flex flex-column justify-content-start align-items-center w-100 h-100'>
        <hr className='text-white border-bottom border-white w-100 mx-auto px-3 text-center' />
        <h6 className='text-left'>Orders:</h6>
        <div className='order-content d-flex flex-column justify-content-start align-items-start w-100 h-100  px-4 border-start border-end  border-white'>
          {<div className='mx-auto'>No Orders Found</div>}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state: any) => ({
  connection: state.session.connection,
});
export default connect(mapStateToProps)(OrderItems);
