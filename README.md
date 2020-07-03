# Private Delegation in Maker [Gitcoin - Protect Privacy Hackathon]

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Our project empowers the Maker Governance Voter to delegate their votes in a privacy presevering fashion. We use the super-powers of zero-knowledge proofs to make it happen. 

When the voter wants to delegate his votes, he comes to our Delegate Vote Function which securely generates the ZK-Note for the Vote Delegation. The ZK-Note can then be sent to user to whom the voter wants to delgate their vote to. The user can then use this ZK-Note to Vote on the proposal. The weight of the vote would correspond to the delegator and the delegate and this makes it much more robust.

We have built the enitre application on top of the Maker Contracts and that makes it 100% compatible with the Maker Specs.

We have written a medium article documenting our journey in the hackathon and the design decisions we made. It's highly recommended to read that too. You can read that [here.](https://medium.com/@akash.minato/privacy-preserving-vote-delegation-in-maker-governance-voting-fd0c03d27ff7)

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
