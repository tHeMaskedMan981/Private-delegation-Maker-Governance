import React, { Component } from 'react'
import { Container, Header, Button, Form, Message, TextArea } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap';
import SJSON from '../contracts/SecretVerifier.json'
import VoteJSON from '../contracts/VoteProxy.json'
import axios from 'axios'

const secret_proof = require('../proof.json')

export class DelegateVote extends Component {
    constructor(props){
        super(props);
        this.state = {secretValue: "", secretHash: "", proof: "",show: false}
    }
    getRandom = async () => {
        let networkId = await this.props.web3.eth.net.getId()
        const voteContractAddress = VoteJSON.networks[networkId].address
        let secretValue, secretHash;
        axios.get('http://localhost:5000/generate_secret')
        .then(resp => {
            secretValue = resp.data.secret;
            console.log(secretValue)
            axios.post('http://localhost:5000/delegate/hash',{
                secret: secretValue
            })
            .then(r => {
                secretHash = r.data.hash
                console.log(secretHash)
                this.setState({voteContractAddress, secretValue: secretValue, secretHash: secretHash})
            })
        })
        
    }
    delegate = async () => {
        const { web3, GOVInstance, DSChiefContractInstance, VoteProxyContractInstance, account} = this.props;
        await VoteProxyContractInstance.methods.setSecret("0x" + this.state.secretHash).send({from:account});
        let networkId = await web3.eth.net.getId()
        const secAddr = SJSON.networks[networkId].address
        // await DSChiefContractInstance.methods.setVerifier(secAddr).send({from:account});
        console.log(this.state.secretValue)
        console.log(this.state.secretHash);

        axios.post(`http://localhost:5000/delegate/proof`, {
            secret: this.state.secretValue,
            secret_hash: this.state.secretHash
        })
        .then(resp => {
            let proof = resp.data
            console.log(proof)
            this.setState({proof, show: true})
        })
    }
    handleShow = () => {

        this.setState({ show: true})

    }

    handleClose = () => {
        this.setState({show: false})
    }
    render() {
        return (
            <Container style={{ padding: "20px", margin: "50px", borderRadius: "5px", backgroundColor: "white"}}>
                <Header as="h2" textAlign="center">Setup Delegation</Header>
                <hr />
                <Form>
                    <Form.Field>
                        <label>Secret Value</label>
                        <input name="secretValue" placeholder='Click on Random to generate Secret Value' readOnly value={this.state.secretValue} />
                        <Button onClick={this.getRandom.bind(this)} style={{marginTop: "10px"}} primary>Random</Button>
                    </Form.Field>
                    <Form.Field>
                        <label>Secret Hash</label>
                        <input name="secretHash" placeholder='Secret Hash' readOnly value={this.state.secretHash}/>
                    </Form.Field>
                    <Button  onClick={this.delegate.bind(this)} primary fluid>Start Delegation</Button>
                </Form>
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Title style={{margin: "10px"}}>Secret Note <hr /></Modal.Title>
                    <Modal.Body style={{overflowWrap:"anywhere" ,marginTop: "-25px"}}>
                        <Message positive>
                        {this.state.voteContractAddress}-{"maker-dao-delegate"}-{btoa(JSON.stringify(this.state.proof))}
                        </Message>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>
                        Close
                    </Button>
                    <Button color="green">
                        Save As File
                    </Button>
                    </Modal.Footer>
            </Modal>
            </Container>
        )
    }
}

export default DelegateVote
