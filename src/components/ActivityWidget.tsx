import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
import Button from './common/button';
const query = gql`
  query Activites($input: QueryInput!) {
    Query_Activity(input: $input) {
      cursor
      continuation
      activities {
        contract {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
        user {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
        nft {
          id
          type
          from
          owner
          contract
          tokenId
          itemId
          value
          purchase
          transactionHash
          date
          reverted
          left {
            maker
            hash
          }
          right {
            maker
            hash
          }
          source
          buyer
          seller
          buyerOrderHash
          sellerOrderHash
          price
          priceUsd
          hash
          auction {
            id
            contract
            type
            seller
            endTime
            minimalStep
            minimalPrice
            createdAt
            lastUpdatedAt
            buyPrice
            buyPriceUsd
            pending
            status
            ongoing
            hash
            auctionId
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
          }
          bid {
            type
            data {
              dataType
              originFees {
                address
                value
              }
              payouts {
                address
                value
              }
              startTime
              duration
              buyOutPrice
            }
            buyer
            amount
            date
            status
          }
        }
      }
    }
  }
`;
export default function ActivityWidget({address}: {address: string}) {
  const [complete, setComplete] = React.useState<boolean>(false);
  const [showContract, setContractBool] = React.useState<boolean>(false);
  const [showUser, setUserBool] = React.useState<boolean>(false);
  const [showNFT, setNFTBool] = React.useState<boolean>(false);
  const [activity, setActivity] = React.useState({
    contract: [],
    nft: [],
    user: [],
  });
  const [cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');

  const [Query_Activity, {loading, error, data, refetch}] = useLazyQuery(
    query,
    {
      onCompleted: ({Query_Activity}: any) => {
        if (Query_Activity !== null && Query_Activity !== undefined) {
          setActivity(Query_Activity.activities);
          setCursor(Query_Activity.cursor);
          setContinuation(Query_Activity.continuation);
          console.log(Query_Activity.cursor, Query_Activity.continuation);
          if (Query_Activity.activities.contract.length > 0) {
            setContractBool(true);
          } else if (Query_Activity.activities.user.length > 0) {
            setUserBool(true);
          } else {
            setNFTBool(true);
          }
          setComplete(true);
        }
      },
    }
  );

  React.useEffect(() => {
    Query_Activity({
      variables: {
        input: {
          address: address,
          activityType: [
            'TRANSFER',
            'BID',
            'SELL',
            'CANCEL',
            'BURN',
            'MINT',
            'CANCEL_BID',
            'CANCEL_LIST',
            'AUCTION_BID',
            'AUCTION_CREATED',
            'AUCTION_CANCEL',
            'AUCTION_FINISHED',
            'AUCTION_STARTED',
            'AUCTION_ENDED',
            'TRANSFER_FROM',
            'TRANSFER_TO',
            'MAKE_BID',
            'GET_BID',
          ],
          size: 50,
          sort: 'LATEST_FIRST',
          continuation: continuation,
          cursor: cursor,
        },
      },
    });
  }, [address]);

  return (
    <>
      <style jsx>
        {`
          .activity-wrapper {
            height: calc(100% - 90px);
          }
        `}
      </style>
      <div className='d-flex flex-column justify-content-start  activity-wrapper'>
        <div className='d-flex flex-row'>
          {activity.contract.length > 0 && (
            <Button
              onClick={() => {
                setContractBool(true);
                setUserBool(false);
                setNFTBool(false);
              }}>
              Contract Activity
            </Button>
          )}
          {activity.user.length > 0 && (
            <Button
              onClick={() => {
                setContractBool(false);
                setUserBool(true);
                setNFTBool(false);
              }}>
              User Activity
            </Button>
          )}
          {activity.nft.length > 0 && (
            <Button
              onClick={() => {
                setContractBool(false);
                setUserBool(false);
                setNFTBool(true);
              }}>
              Nft Activity
            </Button>
          )}
        </div>
        {error && <p>{`${error.message}`}</p>}
        {loading && <p>Loading...</p>}
        {!loading && complete ? (
          <div className='d-inline-flex flex-column border border-dark p-2 overflow-y-scroll h-100'>
            {activity[
              `${showContract ? 'contract' : showUser ? 'user' : 'nft'}`
            ].map((item: any, key) => {
              const date = new Date(Date.parse(item.date));

              return (
                <Activity_Item
                  key={key}
                  id={item.id}
                  date={item.date}
                  type={item.type}
                  from={item.from}
                  to={item.to}
                />
              );
            })}
          </div>
        ) : (
          <p className='m-0 text-center'>
            No Activity Found, Please Try Again, or Search Using Another Address
          </p>
        )}
        {/* <div className='d-flex flex-row'>
          {!loading && complete && (
            <Button
              onClick={() => {
                console.log({
                  input: {
                    address: address,
                    activityType: [
                      'TRANSFER',
                      'BID',
                      'SELL',
                      'CANCEL',
                      'BURN',
                      'MINT',
                      'CANCEL_BID',
                      'CANCEL_LIST',
                      'AUCTION_BID',
                      'AUCTION_CREATED',
                      'AUCTION_CANCEL',
                      'AUCTION_FINISHED',
                      'AUCTION_STARTED',
                      'AUCTION_ENDED',
                      'TRANSFER_FROM',
                      'TRANSFER_TO',
                      'MAKE_BID',
                      'GET_BID',
                    ],
                    size: 50,
                    sort: 'LATEST_FIRST',
                    continuation: continuation,
                    cursor: cursor,
                  },
                });
                refetch({
                  input: {
                    address: address,
                    activityType: [
                      'TRANSFER',
                      'BID',
                      'SELL',
                      'CANCEL',
                      'BURN',
                      'MINT',
                      'CANCEL_BID',
                      'CANCEL_LIST',
                      'AUCTION_BID',
                      'AUCTION_CREATED',
                      'AUCTION_CANCEL',
                      'AUCTION_FINISHED',
                      'AUCTION_STARTED',
                      'AUCTION_ENDED',
                      'TRANSFER_FROM',
                      'TRANSFER_TO',
                      'MAKE_BID',
                      'GET_BID',
                    ],
                    size: 50,
                    sort: 'LATEST_FIRST',
                    continuation: continuation,
                    cursor: cursor,
                  },
                });
              }}>
              Load More
            </Button>
          )}
        </div> */}
      </div>
    </>
  );
}

function Activity_Item({
  id,
  date,
  type,
  from,
  to,
}: {
  id: string;
  date: string;
  type: string;
  from: string;
  to: string;
}) {
  const _date = new Date(Date.parse(date));
  return (
    <>
      <style jsx>
        {`
          .width-10rem {
            width: 10rem !important;
          }
          .width-15rem {
            width: 15rem !important;
          }
          .width-20rem {
            width: 20rem !important;
          }
          .width-25rem {
            width: 25rem !important;
          }
        `}
      </style>
      <div
        id={id}
        className={
          'd-flex flex-column justify-content-center border-bottom border-dark'
        }>
        <div className='d-flex flex-row'>
          <p
            title={moment(date).format('MMMM Do YYYY, h:mm:ss a')}
            className='m-0 px-2 width-15rem'>
            {moment(_date, 'YYYYMMDD').fromNow()}
          </p>{' '}
          | <p className='m-0 width-10rem'>{type}</p> |{' '}
          {from !== null && (
            <p className='m-0'>From: {from.split(':')[1]} | </p>
          )}
        </div>
      </div>
    </>
  );
}
