import React from 'react';
import ConnectPage from '../src/views/connect/connect-page';
import {ConnectOptions} from '../src/views/connect/connect-options';
import {ConnectorContext} from '../src/components/connector/sdk-connection-provider';
export default function _Index() {
  const connection = React.useContext(ConnectorContext);
  const blockchain = connection.sdk?.wallet?.blockchain;
  return (
    <div className=''>
      <div>{connection.state.status}</div>
      <div>TAKO LABS on: {blockchain}</div>
			<div>
				{connection.state.status !== 'connected' && <ConnectOptions />}
			</div>
      
    </div>
  );
}
