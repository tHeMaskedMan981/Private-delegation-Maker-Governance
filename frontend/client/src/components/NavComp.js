import React, { Component } from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


export class NavComp extends Component {
    render() {
        return (
            <div>
            <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <img alt="logo" style={{marginLeft: "100px", marginRight: "30px"}}src="https://positiveblockchain.io/wp-content/uploads/2019/07/maker-lrg-510x510-1.png" height="50" width="50" />
                    <span>Governance</span>
                </Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="/">Cast Vote</Nav.Link>
                    <Nav.Link href="/delegateVote">Cast Delegate Vote</Nav.Link>
                    <Nav.Link href="/delegate">Delegate Vote</Nav.Link>
                    <Nav.Link>{this.props.accounts ? this.props.accounts.toString().slice(0,12) + "..." : <Button variant="outline-success">Connect to Wallet</Button>}</Nav.Link>
                </Nav>
            </Navbar>
            </div>
        )
    }
}

export default NavComp
