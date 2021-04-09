import { useState, useEffect } from 'react';

import { Container, Grid, } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import NewPaymentConsent from './NewPaymentConsent';


import ChargersList from './delmonicos/ChargersList';
import Payment from './delmonicos/Payment';

export default function Delmonicos({ accountPair }) {
  const { api, keyring } = useSubstrate();
  const [chargerOrganization, setChargerOrganization] = useState(null);
  const [chargers, setChargers] = useState([]);

  /*const loadPastEvents = async () => {
    const lastBlock = await api.rpc.chain.getBlock();
    const lastBlockNum = lastBlock.block.header.number.toNumber();
    const events = [];
    for(let i = 1; i <= lastBlockNum; i++) {
      console.log(i+'/'+lastBlockNum);
      const blockHash = await api.rpc.chain.getBlockHash(i);
      const events = await api.query.system.events.at(blockHash);
      events.forEach((e) => {
        if(e.event.data.section === 'sessionPayment'
          || e.event.data.section === 'chargeSession'
        ) {
          events.push(e.event.data);
        }
      });
    }
  };*/

  useEffect(() => {
    if(chargerOrganization) {
      const keypairs = keyring.getPairs();
      const getAccountName = (address) => {
        const account = keypairs.find((k) => k.address === address);
        return (account?.meta?.name || '');
      };
      api.query.registrar
        .membersOf(chargerOrganization)
        .then((accounts) => setChargers(accounts.map((a) => ({
          address: a.toString(),
          name: getAccountName(a.toString()),
        }))));
    }
  }, [chargerOrganization]);

  useEffect(() => {
    api.query.chargeSession
      .chargerOrganization()
      .then((org)=> setChargerOrganization(org.toString()));
  }, []);

  return (
    <Container>
      <Grid stackable columns='equal'>
        <Grid.Row stretched>
          <Grid.Column>
            <ChargersList
              organization={chargerOrganization}
              chargers={chargers}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column>
            <Payment selectedAccount={accountPair} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column>
            <NewPaymentConsent accountPair={accountPair} />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </Container>
  );
};
