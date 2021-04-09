import React, { useState } from 'react';
import { Form, Input, Grid, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ iban: '1234', bic: '5678' });
  const { accountPair } = props;

  const onChange = (_, data) =>
      setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { iban, bic } = formState;

  return (
      <Grid.Column width={8}>
        <h1>New payment consent</h1>
        <Form>

          <Form.Field>
            <Input
                fluid
                label='IBAN'
                type='text'
                placeholder='IBAN'
                state='iban'
                onChange={onChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
                fluid
                label='BIC'
                type='text'
                placeholder='Code BIC'
                state='bic'
                onChange={onChange}
            />
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
                accountPair={accountPair}
                label='Submit'
                type='SIGNED-TX'
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'sessionPayment',
                  callable: 'newConsent',
                  inputParams: [iban, bic],
                  paramFields: [true, true]
                }}
            />
          </Form.Field>
          <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form>
      </Grid.Column>
  );
}
