import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import DSChiefContract from "./contracts/DSChief.json"
import VoteProxyContract from "./contracts/VoteProxy.json";
import GOV from './contracts/DSTokenGOV.json'
import getWeb3 from "./getWeb3";
import { Button } from 'semantic-ui-react'
import getContractInstance from './getContractInstance'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import NavComp from "./components/NavComp";
import Home from './components/Home'
import DelegateVote from "./components/DelegateVote";
import Delegate from "./components/Delegate";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const DSChiefContractInstance = await getContractInstance(web3, DSChiefContract);
      const VoteProxyContractInstance = await getContractInstance(web3, VoteProxyContract);
      const GOVInstance = await getContractInstance(web3, GOV);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, DSChiefContractInstance, VoteProxyContractInstance, GOVInstance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <NavComp 
          accounts={this.state.accounts[0]}
        />
        <Router>
          <Switch>
            <Route exact path="/" component={() => <Home 
              web3 = {this.state.web3}
              account = {this.state.accounts[0]}
              contract = {this.state.contract}
              DSChiefContractInstance = {this.state.DSChiefContractInstance}
              VoteProxyContractInstance = {this.state.VoteProxyContractInstance}
              GOVInstance = {this.state.GOVInstance}
            />} />
            <Route exact path="/delegate" component={() => <DelegateVote 
              web3 = {this.state.web3}
              account = {this.state.accounts[0]}
              contract = {this.state.contract}
              DSChiefContractInstance = {this.state.DSChiefContractInstance}
              VoteProxyContractInstance = {this.state.VoteProxyContractInstance}
              GOVInstance = {this.state.GOVInstance}
            />} />
            <Route exact path="/delegateVote" component={() => <Delegate 
              web3 = {this.state.web3}
              account = {this.state.accounts[0]}
              contract = {this.state.contract}
              DSChiefContractInstance = {this.state.DSChiefContractInstance}
              VoteProxyContractInstance = {this.state.VoteProxyContractInstance}
              GOVInstance = {this.state.GOVInstance}
            />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
