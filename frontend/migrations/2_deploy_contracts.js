const DSChief = artifacts.require("DSChief");
const DSTokenGOV = artifacts.require("DSTokenGOV");
const DSTokenIOU = artifacts.require("DSTokenIOU");
const VoteProxy = artifacts.require("VoteProxy");
const SecretVerifier = artifacts.require("SecretVerifier");
const Web3 = require('web3');
const url = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

module.exports = async function(deployer) {
    
    const accounts = await web3.eth.getAccounts();
    await deployer.deploy(DSTokenGOV, web3.utils.fromAscii("GOV"));
    const gov = await DSTokenGOV.deployed();
    const gova = gov.address;

    await deployer.deploy(DSTokenIOU, web3.utils.fromAscii("IOU"));
    const iou = await DSTokenIOU.deployed();
    const ioua = iou.address;

    await deployer.deploy(DSChief, gova, ioua, 1000);
    const chief = await DSChief.deployed();

    await deployer.deploy(VoteProxy, chief.address, accounts[0], accounts[0]);
    await deployer.deploy(SecretVerifier);

};
