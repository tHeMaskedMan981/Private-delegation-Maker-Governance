import React, { Component } from 'react'
import { Container, Header, Card, Button, Loader, Form } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'
import VoteJSON from '../contracts/VoteProxy.json'

export class Home extends Component {
    constructor(props){
        super(props);
        this.state = {account5Votes: null, show: false, active: 5}
    }
    componentWillMount = async () => {
        const { web3, DSChiefContractInstance, VoteProxyContractInstance, account} = this.props;
        const account5 = "0xd03ea8624C8C5987235048901fB614fDcA89b117"
        const account6 = "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC"
        let account6Votes = await DSChiefContractInstance.methods.approvals("0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC").call()
        let account5Votes = await DSChiefContractInstance.methods.approvals(account5).call()
        const networkId = await web3.eth.net.getId()
        const voteContractAddress = VoteJSON.networks[networkId].address
        this.setState({account5, account5Votes, account6, account6Votes, voteContractAddress})

    }
    vote = async () => {
        const { GOVInstance, DSChiefContractInstance, VoteProxyContractInstance, account} = this.props;
        // await GOVInstance.methods.mint(account, 10000).send({from:account});
        // await GOVInstance.methods.approve(this.state.voteContractAddress, 4000000).send({from:account});
        // await VoteProxyContractInstance.methods.lock(800).send({from:account});
        if(this.state.active == 5){
            await VoteProxyContractInstance.methods.vote([this.state.account5]).send({from: account})
        }else{
            await VoteProxyContractInstance.methods.vote([this.state.account6]).send({from: account})
        }
    }

    handleShow = (e) => {
        let a = e.target.name
        this.setState({active:a, show: true})
    }

    handleClose = () => {
        this.setState({show: false})
    }
    render() {
        return (
            <div>
            <Container style={{ padding: "20px", margin: "50px", borderRadius: "5px", backgroundColor: "white"}}>
                <Header as="h2" textAlign="center">Proposal List</Header>
                <hr />
                <Card.Group>
                    <Card fluid 
                    color="green" 
                    header="Poll: Should we add KNC to the Maker Protocol? - June 22, 2020" 
                    meta={<span style={{color: "#546978"}}><i className="clock outline icon" />Time left to vote 4 days 6 hours 47 minutes<hr /></span>}
                    description = {
                    <div>
                        <span>If passed, this poll is to be taken as a signal to domain teams that MKR Token Holders have approved further domain work with the aim of adding KNC as a collateral asset to the Maker Protocol.</span>
                        <div style={{marginTop: "30px", color: "#546978"}}>Total Votes: <span>{this.state.account5Votes ? this.state.account5Votes : <Loader active inline size="mini" />} MKR</span>
                        <Button name="5" onClick={this.handleShow.bind(this)} style={{backgroundColor: "#1AAB9B", color: "white"}} floated="right"><i className="hand point up outline icon" />Vote on Proposal</Button>

                        </div>
                    </div>}
                    />
                    <Card fluid 
                    color="green" 
                    header="Poll: Adjust the WBTC Debt Ceiling and Risk Premium - June 29, 2020" 
                    meta={<span style={{color: "#546978"}}><i className="clock outline icon" />Time left to vote 2 hours 53 minutes
                    <hr /></span>}
                    description = {
                    <div>
                        <span>The Governance Facilitators have placed a Governance Poll into the voting system on behalf of the Maker Governance Community. The community can use this poll express support or opposition to increasing the WBTC Debt Ceiling from 10m to 20m, and increasing the WBTC Risk Premium from 1% to 2%.</span>
                        <div style={{marginTop: "30px", color: "#546978"}}>Total Votes: <span>{this.state.account6Votes ? this.state.account6Votes : <Loader active inline size="mini" />} MKR</span>
                        <Button name="6" onClick={this.handleShow.bind(this)} style={{backgroundColor: "#1AAB9B", color: "white"}} floated="right"><i className="hand point up outline icon" />Vote on Proposal</Button>

                        </div>
                    </div>}
                    />
                </Card.Group>
               
            </Container>
            <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Title style={{margin: "10px"}}>Select Option to Vote <hr /></Modal.Title>
                    <Modal.Body style={{marginTop: "-25px"}}>
                        <Form>
                        <Form.Field label='Select Option' control='select'>
                            <option value='yes'>Yes</option>
                            <option value='No'>No</option>
                        </Form.Field>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>
                        Close
                    </Button>
                    <Button color="green" onClick={this.vote.bind(this)}>
                        Vote Now
                    </Button>
                    </Modal.Footer>
            </Modal>
            </div>
        )
    }
}

export default Home
    