import {Button, Table, Modal, Header, Icon, Form, Input, Grid} from 'semantic-ui-react';
import {useEffect, useState} from 'react';
import {stringToU8a, u8aToHex, hexToU8a} from "@polkadot/util";
import {useSubstrate} from "../substrate-lib";

export default function Main(props) {
    const {api, keyring} = useSubstrate();
    const [consents, setConsents] = useState([]);

    useEffect(() => {
        let unsubscribeAll = null;
        const keypairs = keyring.getPairs();
        const getAccountName = (address) => {
            const account = keypairs.find((k) => k.address === address);
            return (account?.meta?.name || '');
        };

        api.query.sessionPayment
            .allowedUsers((consents) => setConsents((consents.map((a) => ({
                address: a[0].toString(),
                name: getAccountName(a[0].toString()),
                sig: a[1].toString()
            }))))).then(unsub => {
            unsubscribeAll = unsub;
        }).catch(console.error);
        return () => unsubscribeAll && unsubscribeAll();
    }, [api, keyring, setConsents]);

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
                    {consents.map(user =>
                        <Table.Row key={user}>
                            <Table.Cell>
                                {user.address}
                            </Table.Cell>
                            <Table.Cell>
                                {user.name}
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

const VerifySignature = ({consent}) => {
    const [open, setOpen] = useState(false)
    const [bic, setBic] = useState('');
    const [iban, setIban] = useState('');
    const [iconColor, setIconColor] = useState('white');
    const [iconName, setIconName] = useState('none');

    const validate = () => {
        const message = bic + iban;
        const signature = hexToU8a(consent.sig);
        const keypairs = keyring.getPairs();
        const account = keypairs.find((k) => k.address === consent.address);
        if (account.verify(message, signature)) {
            showResultIcon(1);
        } else {
            showResultIcon(-1);
        }
    };

    const openDialog = () => {
        setBic('');
        setIban('');
        showResultIcon(0);
        setOpen(true);
    };

    const showResultIcon = (state) => {
        switch (state) {
            case -1:
                setIconColor('red');
                setIconName('thumbs down');
                break;
            case 1:
                setIconColor('green');
                setIconName('thumbs up');
                break;
            default:
                setIconColor('white');
                setIconName('');
        }
    }

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
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Form>
                        <Form.Field>
                            <Input
                                placeholder='BIC'
                                value={bic}
                                onChange={(_, {value}) => setBic(value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                placeholder='IBAN'
                                value={iban}
                                onChange={(_, {value}) => setIban(value)}
                            />
                        </Form.Field>
                    </Form>
                    <div style={{width: '100%'}}>
                        <Icon style={{display: 'block', marginRight: 'auto', marginLeft: 'auto'}} color={iconColor}
                              name={iconName} size='huge'/>
                    </div>
                </div>
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
