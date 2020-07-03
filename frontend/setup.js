// const Web3 = require('web3');
// const url = "http://localhost:8545";
// const web3 = new Web3(new Web3.providers.HttpProvider(url));
// const DSChiefJSON = require('./client/src/contracts/DSChief.json')
// const VoteProxyJSON = require('./client/src/contracts/VoteProxy.json')
// const GOVJSON = require('./client/src/contracts/DSTokenGOV.json')
// const SecJSON = require('./client/src/contracts/SecretVerifier.json')

// let networkId;
// let accounts;
// let VoteProxyContract, DSChiefContract, GOVContract;
// let deployedAddress;
// let secAddr;

// web3.eth.getAccounts().then(a => {
//     accounts = a;
//     web3.eth.net.getId().then((i) => {
//         networkId = i
//         DSChiefContract = getContractInstance(web3, DSChiefJSON);
//         VoteProxyContract = getContractInstance(web3, VoteProxyJSON);
//         deployedAddress = VoteProxyJSON.networks[networkId].address
//         secAddr = SecJSON.networks[networkId].address;

//         GOVContract = getContractInstance(web3, GOVJSON);
//     }).then(() => {
//         GOVContract.methods.mint(accounts[0], 10000).send({from: accounts[0]}).then(()=> {
//             GOVContract.methods.approve(deployedAddress, 4000000).send({from: accounts[0]}).then(()=> {
//                 // VoteProxyContract.methods.lock(800).send({from: accounts[0]})
//                 DSChiefContract.methods.setVerifier(secAddr).send({from:accounts[0]});
//             })
//         })
//     })
// })



// function getContractInstance(web3, contractDefinition){
//     let deployedAddress = contractDefinition.networks[networkId].address
  
//     // create the instance
//     const instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress)
//     return instance
// }


const Web3 = require("web3");
const fs = require("fs");
const url = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const BigNumber = require('bignumber.js');


DSChief = require("./client/src/contracts/DSChief.json");
VoteProxy = require("./client/src/contracts/VoteProxy.json");
DSTokenGOV = require("./client/src/contracts/DSTokenGOV.json");
SecretVerifier = require("./client/src/contracts/SecretVerifier.json");


let DSChiefInstance, VoteProxyInstance, DSTokenGOVInstance, SecretVerifierInstance;
let voteProxyAddress, secretAddress;
async function getContracts() {
    console.log("Retrieving contract information...")
    let chainId = await web3.eth.net.getId()
    DSChiefInstance = new web3.eth.Contract(DSChief.abi, DSChief["networks"][chainId.toString()]["address"]);
    voteProxyAddress = VoteProxy["networks"][chainId.toString()]["address"];
    secretAddress = SecretVerifier["networks"][chainId.toString()]["address"];
    VoteProxyInstance = new web3.eth.Contract(VoteProxy.abi, VoteProxy["networks"][chainId.toString()]["address"]);
    DSTokenGOVInstance = new web3.eth.Contract(DSTokenGOV.abi, DSTokenGOV["networks"][chainId.toString()]["address"]);
    SecretVerifierInstance = new web3.eth.Contract(SecretVerifier.abi, SecretVerifier["networks"][chainId.toString()]["address"]);
}

let accounts;

async function setupElection() {

    await getContracts();
    accounts = await web3.eth.getAccounts();
    let voter = accounts[0];

    console.log(voter);
    
    var tx_hash = await DSTokenGOVInstance.methods.mint(voter).send({
      from:accounts[0],gas:600000 
    }).on("receipt", receipt => {
      console.log("minting done");
    });
    console.log(BigNumber(await DSTokenGOVInstance.methods._balances(accounts[0]).call()).toFixed() );

    await DSTokenGOVInstance.methods.approve(voteProxyAddress, 4000000).send({from:voter,gas:600000});
    await VoteProxyInstance.methods.lock(800).send({from:voter,gas:600000});
    console.log(BigNumber(await DSChiefInstance.methods.deposits(voteProxyAddress).call()).toFixed() );
    await DSChiefInstance.methods.setVerifier(secretAddress).send({from: voter})
    
}

setupElection()