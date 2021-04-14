import {Button, Table, Modal, Header, Icon, Form, Input, Grid} from 'semantic-ui-react';
import { useState } from 'react';
import {stringToU8a, u8aToHex, hexToU8a} from "@polkadot/util";

export default function PaymentConsentList({ consents }) {
  return (
    <div>
      <h1>Payment Consents</h1>
      <Table celled striped size='small'>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={4}>
              <strong>Address</strong>
            </Table.Cell>
            <Table.Cell width={8}>
              <strong>Name</strong>
            </Table.Cell>
            <Table.Cell width={8}>
            </Table.Cell>
          </Table.Row>
          { consents.map(user =>
            <Table.Row key={user}>
              <Table.Cell>
                { user.address }
              </Table.Cell>
              <Table.Cell>
                { user.name }
              </Table.Cell>
              <Table.Cell>
                <VerifySignature consent={user}/>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

const VerifySignature= ({consent}) => {
  const [open, setOpen] = useState(false)
  const [bic, setBic] = useState('');
  const [iban, setIban] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  const validate = () => {
    const message = bic + iban;
    const signature = hexToU8a(consent.sig);
    const keypairs = keyring.getPairs();
    const account = keypairs.find((k) => k.address === consent.address);
    const isValid = account.verify(message, signature);
    setVerificationResult('Résultat : ' + isValid);
  };

  const openDialog= () => {
    setBic('');
    setIban('');
    setVerificationResult('');
    setOpen(true);
  };

  return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => openDialog()}
          open={open}
          trigger={<Button>Validate</Button>}
      >
        <Modal.Header>Consent Verification for {consent.name}</Modal.Header>
        <Modal.Content>
          <p>
            Stored signature : <small>{consent.sig}</small>
          </p>
          <Modal.Description>
            <Header>Enter the information you want to verify</Header>
            <p/>
          </Modal.Description>
          <Form>
            <Form.Field>
              <Input
                  placeholder='BIC'
                  value={bic}
                  onChange={(_,{ value }) => setBic(value)}
              />
            </Form.Field>
            <Form.Field>
              <Input
                  placeholder='IBAN'
                  value={iban}
                  onChange={(_,{ value }) => setIban(value)}
              />
            </Form.Field>
          </Form>
          <p>
            {verificationResult}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
              content="Validate"
              labelPosition='right'
              icon='checkmark'
              onClick={() => validate()}
              positive
          />
          <Button color='red' onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
  );
};
