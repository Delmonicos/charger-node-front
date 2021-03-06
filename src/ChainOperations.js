import { Container, Grid, } from 'semantic-ui-react';

import { DeveloperConsole } from './substrate-lib/components';
import Balances from './Balances';
import Events from './Events';
import Interactor from './Interactor';
import TemplateModule from './TemplateModule';
import Transfer from './Transfer';
import Upgrade from './Upgrade';


export default function ChainOperations({ accountPair }) {
  return (
    <div>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer accountPair={accountPair} />
            <Upgrade accountPair={accountPair} />
          </Grid.Row>
          <Grid.Row>
            <Interactor accountPair={accountPair} />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule accountPair={accountPair} />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  );
};
