import { useState } from 'react';
import { Icon, Loader, Grid, Dropdown, Button, Form, Input } from 'semantic-ui-react'

import { useSubstrate } from '../substrate-lib';
import { stringToU8a, u8aToHex, u8aToString } from '@polkadot/util';

const CheckConsent = () => {
  const { api, keyring } = useSubstrate();

  const [isConsentLoading, setConsentLoading] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);

  const accounts = keyring.getPairs().map((k) => ({
    key: k.address.toString(),
    value: k.address.toString(),
    text: k.meta.name,
  }));

  const checkStatus = (account) => {
    setConsentStatus(null);
    setConsentLoading(true);
    api.query.sessionPayment
      .userConsents(account)
      .then((res) => {
        setConsentLoading(false);
        setConsentStatus(res);
      });
  };
  return (
    <div>
      <div>
        <h5>
          Check consent of an account
        </h5>
        <Grid>
          <Grid.Column width={6}>
            <Dropdown
              placeholder="Select an account"
              search
              fluid
              selection
              options={accounts}
              onChange={(_,data) => checkStatus(data.value)}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            { consentStatus !== null && (
              consentStatus.isSome
                ? 'Account has payment consent'
                : 'Account has NO payment consent'
            )}
            { isConsentLoading && (
              <Loader active />
            )}
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
};

const SaveConsent = ({ selectedAccount }) => {
  const { api } = useSubstrate();

  const [bic, setBic] = useState('');
  const [iban, setIban] = useState('');
  const [isConsentLoading, setConsentLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);

  const addConsent = () => {
    setTxStatus('pending');
    setConsentLoading(true);

    const message = stringToU8a(bic + iban);
    const signature = selectedAccount.sign(message);

    api.tx.sessionPayment
      .newConsent(bic, iban, u8aToHex(signature))
      .signAndSend(
        selectedAccount,
        (res) => {
          setBic('');
          setIban('');
          if(res.status.isInBlock) {
            setTxStatus('in_block');
            setConsentLoading(false);
          }
          else if(res.status.isFinalized)
            setTxStatus('finalized');
        }
      );
  };

  return (
    <div style={{ marginTop: '20px'}}>
      <h5>
        Add payment consent
      </h5>
      <Grid>
        <Grid.Column width={6}>
          <Form>
            <Form.Field>
              <Input
                placeholder='BIC'
                fluid
                disabled={isConsentLoading}
                value={bic}
                onChange={(_,{ value }) => setBic(value)}
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder='IBAN'
                fluid
                disabled={isConsentLoading}
                value={iban}
                onChange={(_,{ value }) => setIban(value)}
              />
            </Form.Field>
            <Form.Field>
              <Button
                fluid
                disabled={
                  selectedAccount === null
                  || bic.length === 0
                  || iban.length === 0
                  || isConsentLoading
                }
                onClick={addConsent}
              >
                Add consent for { selectedAccount.meta.name }
              </Button>
            </Form.Field>
          </Form>
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={6}>
          { isConsentLoading && (
            <Loader active />
          )}
          { txStatus === 'pending' && (
            <span>
              <Icon circular name='question circle' style={{marginRight: '10px'}} />
              Pending...
            </span>
          )}
          { txStatus === 'in_block' && (
            <span>
              <Icon circular name='save green' style={{marginRight: '10px'}} />
              In block
            </span>
          )}
          { txStatus === 'finalized' && (
            <span>
              <Icon circular name='gavel green' style={{marginRight: '10px'}} />
              Finalized
            </span>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default function Payment({ selectedAccount }) {
  return (
    <div>
      <h1>Payment</h1>
      <h3>Consent</h3>
      <CheckConsent />
      <SaveConsent selectedAccount={selectedAccount} />
    </div>
  );
};
