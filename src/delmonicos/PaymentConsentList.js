import { Table } from 'semantic-ui-react';

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
          </Table.Row>
          { consents.map(user =>
            <Table.Row key={user}>
              <Table.Cell>
                { user.address }
              </Table.Cell>
              <Table.Cell>
                { user.name }
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
