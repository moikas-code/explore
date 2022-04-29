import React from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import moment from 'moment';
import Button from './common/button';
import {truncateAddress} from '../lib/moiWeb3';
import TabButton from './TabButton';
import TakoLink from './TakoLink';
const query = gql`
  query Activites($input: QueryInput) {
    Query_All_Activity(input: $input) {
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
export default function ActivityWidget() {
  const [complete, setComplete] = React.useState<boolean>(false);
  const [showContract, setContractBool] = React.useState<boolean>(false);
  const [showUser, setUserBool] = React.useState<boolean>(false);
  const [showNFT, setNFTBool] = React.useState<boolean>(false);
  const [activity, setActivity] = React.useState([]);
  const [cursor, setCursor] = React.useState<string>('');
  const [continuation, setContinuation] = React.useState<string>('');

  const [Query_All_Activity, {loading, error, data, refetch}] = useLazyQuery(
    query,
    {
      onCompleted: ({Query_All_Activity}: any) => {
        console.log(Query_All_Activity);
        if (Query_All_Activity !== null && Query_All_Activity !== undefined) {
          setActivity(Query_All_Activity.activities);
          setCursor(Query_All_Activity.cursor);
          setContinuation(Query_All_Activity.continuation);
          setComplete(true);
        }
      },
    }
  );

  React.useEffect(() => {
    Query_All_Activity({
      variables: {
        input: {
          sort: 'LATEST_FIRST',
          continuation: continuation,
          cursor: cursor,
        },
      },
    });
    return () => {
      setComplete(false);
    };
  }, []);

  React.useEffect(() => {}, [activity]);

  return (
    <>
      <style jsx>
        {`
        
          .activity-labels {
            min-width: 1200px;
          }
        `}
      </style>
      <div className=' activity-wrapper d-flex flex-column justify-content-start '>
        {error && <p>{`${error.message}`}</p>}
        {loading && <p>Loading...</p>}
        {complete && (
          <>
            Latest Activity: {activity.length}
            <div className=' d-inline-flex flex-column border border-dark p-2 mb-5 overflow-auto w-100'>
              <div
                className={
                  'activity-labels d-flex flex-column justify-content-center w-100 border-bottom border-dark'
                }>
                <div className='d-flex flex-row'>
                  <p className='m-0 px-2 width-15rem'>Age</p> |
                  <p className='m-0 px-2 width-10rem'>Type</p> |
                  <p className='m-0 px-2 width-10rem'>Token ID</p> |
                  <p className='m-0 px-2 width-10rem'>From</p> |
                  <p className='m-0 px-2 width-10rem'>Owner</p> |
                  <p className='m-0 px-2 width-10rem'>Contract</p> |
                </div>
              </div>
              {activity.length > 0 ? (
                activity.map((item: any, key) => (
                  <Activity_Item
                    key={key}
                    id={item.id}
                    date={item.date}
                    type={item.type}
                    from={item.from}
                    contractAddress={item.contract}
                    tokenId={item.tokenId}
                    owner={item.owner}
                    contract={item.contract}
                  />
                ))
              ) : (
                <p className='m-0 text-center'>
                  No Activity Found, Please Try Again, or Search Using Another
                  Address
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Activity_Item({
  id,
  date,
  type,
  from,
  contractAddress,
  tokenId,
  owner,
  contract,
}: {
  id: string;
  date: string;
  type: string;
  from: string;
  contractAddress: string;
  tokenId: string;
  owner: string;
  contract: any;
}) {
  const _date = new Date(Date.parse(date));
  return (
    <>
      <style jsx>{`
        .activity-item {
          min-width: 1200px;
        }
      `}</style>
      <div
        id={id}
        className={
          'activity-item d-flex flex-column justify-content-center border-bottom border-dark w-100'
        }>
        <div className='d-flex flex-row'>
          <p
            title={moment(date).format('MMMM Do YYYY, h:mm:ss a')}
            className='m-0 px-2 width-15rem'>
            {moment(_date, 'YYYYMMDD').fromNow()}
          </p>{' '}
          | <p className='m-0  px-2 width-10rem'>{type}</p> |{' '}
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {tokenId !== null ? (
                <TakoLink
                  href={`/o/${contractAddress}:${tokenId}`}
                  as={`/o/${from}`}>
                  {tokenId}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {from !== null ? (
                <TakoLink href={`/o/${from}`} as={`/o/${from}`}>
                  {from.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {owner !== null ? (
                <TakoLink href={`/o/${owner}`} as={`/o/${owner}`}>
                  {owner.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
          <>
            {' '}
            <p className='m-0 px-2 width-10rem text-truncate'>
              {contract !== null ? (
                <TakoLink href={`/o/${contract}`} as={`/o/${contract}`}>
                  {contract.split(':')[1]}
                </TakoLink>
              ) : (
                'N/A'
              )}
            </p>{' '}
            |{' '}
          </>
        </div>
      </div>
    </>
  );
}
