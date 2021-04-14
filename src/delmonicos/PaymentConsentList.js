import {Button, Table} from 'semantic-ui-react';
import {stringToU8a, u8aToHex, hexToU8a} from "@polkadot/util";

export default function PaymentConsentList({ consents }) {
  const validate = (u) => {
    const message = prompt('Please enter IBAN and Bic Code concatenated');
    const signature = hexToU8a(u.sig);
    const keypairs = keyring.getPairs();
    const account = keypairs.find((k) => k.address === u.address);
    const isValid = account.verify(message, signature);
    alert(isValid);
  };

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
                <Button onClick={() => validate(user)}>
                    Validate
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
