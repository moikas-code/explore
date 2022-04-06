import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {ConnectOptions} from '../src/views/connect/connect-options';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';
export default function Analytics() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  const router = useRouter();
  useEffect(() => {
    connection.state.status === 'connected' && router.push('/');
  }, [connection]);
  if (connection.state.status == 'initializing') {
    return <div>Loading...</div>;
  }
  if (connection.state.status == 'disconnected') {
    return (
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
       
         }
        
      </div>
    );
  }
  return null;
}
