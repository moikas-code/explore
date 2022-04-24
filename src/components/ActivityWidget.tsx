import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
const query = gql`
  query Activites($input: QueryInput!) {
    Query_Activity(input: $input) {
      cursor
      continuation
      activities {
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
`;
export default function ActivityWidget({address}: {address: string}) {
  const [complete, setComplete] = React.useState<boolean>(false);
  const [activity, setActivity] = React.useState<any[]>([]);
  const [cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');

  const [Query_Activity, {loading, error, data}] = useLazyQuery(query, {
    onCompleted: ({Query_Activity}: any) => {
      console.log({Query_Activity});
      if (Query_Activity !== null && Query_Activity !== undefined) {
        console.log(Query_Activity);
        setActivity(Query_Activity.activities);
        setCursor(Query_Activity.cursor);
        setContinuation(Query_Activity.continuation);
        setComplete(true);
      }
    },
  });

  React.useEffect(() => {
    Query_Activity({
      variables: {
        input: {
          address: address,
          activityType: [
            'TRANSFER_TO',
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
            height: calc(100% - 50px);
          }
        `}
      </style>
      <div className='d-flex flex-column justify-content-start  activity-wrapper'>
        <p>Activity</p>
        {error && <p>{`${error.message}`}</p>}
        {loading && <p>Loading...</p>}
        {complete && activity.length > 0 ? (
          <div className='d-inline-flex flex-column border border-dark p-2 overflow-y-scroll'>
            {activity.map((item, key) => {
              const date = new Date(Date.parse(item.date))
              let _Month = new Date(Date.parse(item.date)).getUTCMonth();
              let _Date = new Date(Date.parse(item.date)).getDate();
              let _Year = new Date(Date.parse(item.date)).getFullYear();
              // const timeFromNow = new Date(
              //   Date.parse(`${startDate}`) - _Date
              // ).getMilliseconds();

              // if (key === 0)
                return (
                  <div
                    key={key}
                    id={item.id}
                    className={
                      'd-flex flex-column justify-content-center border-bottom border-dark'
                    }>
                    <div className='d-flex flex-row'>
                      <p className='m-0'>
                        {moment(date, 'YYYYMMDD').fromNow()}
                      </p>{' '}
                      |{' '}
                      <p className='m-0'>
                        {moment(item.date).format('MMMM Do YYYY, h:mm:ss a')}
                      </p>{' '}
                      | <p className='m-0'>{item.type}</p> |{' '}
                      {item.itemId !== null && (
                        <p className='m-0'>Item ID: {item.itemId} | </p>
                      )}{' '}
                      |
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <p className='m-0 text-center'>
            No Activity Found, Please Try Again, or Search Using Another Address
          </p>
        )}
      </div>
    </>
  );
}
