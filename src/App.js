import React, { useState, createRef } from 'react';
import { Tab, Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

import ChainOperations from './ChainOperations';
import DelmonicosOperations from './DelmonicosOperations';

import AccountSelector from './AccountSelector';
import NodeInfo from "./NodeInfo";
import Metadata from "./Metadata";
import BlockNumber from "./BlockNumber";

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  const tabContent = children =>
    <div style={{ paddingTop: '20px' }}>
      { children }
    </div>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  const tabs = [
    {
      menuItem: 'Substrate',
      render: () => tabContent(<ChainOperations accountPair={accountPair} />)
    },
    {
      menuItem: 'Delmonicos',
      render: () => tabContent(<DelmonicosOperations accountPair={accountPair} />)
    }
  ];

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
        </Grid>
        <p/>
        <Tab panes={tabs} />
      </Container>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
