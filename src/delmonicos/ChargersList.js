import { Table } from 'semantic-ui-react';

export default function ChargersList({ organization, chargers }) {
  return (
    <div>
      <h1>Chargers</h1>
      <div>
        Organization:
        &nbsp;
        <code>{ organization || '' }</code>
      </div>
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
          { chargers.map(charger =>
            <Table.Row key={charger}>
              <Table.Cell>
                { charger.address }
              </Table.Cell>
              <Table.Cell>
                { charger.name }
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
