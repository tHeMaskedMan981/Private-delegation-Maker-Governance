# Private Delegation in Maker [Gitcoin - Protect Privacy Hackathon]

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Our project empowers the Maker Governance Voter to delegate their votes in a privacy-presevering fashion. We use the zero-knowledge proofs to make it happen. 
When the voter wants to delegate his votes, he comes to our Delegate Vote Function where he performs a one-time setup, and then it securely generates the ZK-Note for the Vote Delegation. The ZK-Note can then be sent to user to whom the voter wants to delgate their vote to via an off-chain communication channel. The user(delegate) can then use this ZK-Note to Vote on the proposal. The weight of the vote would correspond to the MKR locked by the delegator in the voting contract. This makes sure the identity of the delegate is private till the point he actually votes. Therefore the delegate is safe from any influencing, bribing, or any other illicit activities.

We have built the enitre application on top of the Maker Contracts(voteProxy.sol and chief.sol) and that makes it easily integrable with the Maker Specs.

We have written a medium article documenting our journey in the hackathon and the design decisions we made. It's highly recommended to read that too. You can read that [here.](https://medium.com/@akash.minato/privacy-preserving-vote-delegation-in-maker-governance-voting-fd0c03d27ff7)

We also have a video demo [here.](https://vimeo.com/434983695)

# Installation

```sh
$ git clone https://github.com/tHeMaskedMan981/Private-delegation-Maker-Governance.git
$ cd Private-delegation-Maker-Governance
$ cd zk_library
$ npm install
$ cd frontend
$ npm install
$ cd frontend/client
$ npm install
````
# Deploying Contract and Seting up 
```sh
$ cd frontend
$ truffle migrate --reset --network develop
$ node setup.js
$ cd zk_library
$ node server.js
```

# Serving the Application
```sh
$ cd frontend/client
$ npm start
```

And that's it we are good to go. Please feel free to reach out to us with any improvements.
