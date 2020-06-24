const express = require('express')
const Web3 = require("web3");
const fs = require("fs");
const bodyParser = require('body-parser');
const url = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

let secretVerifier, accounts;
secretVerifier = require("./verify/build/contracts/SecretVerifier.json");


// const { generate_age_proof, generate_secret_proof, get_hash } = require('./zklib')
const zklib = require('./zklib')
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/generate_secret/',async (req,res) => {

    let secret = zklib.get_secret();
    res.json({secret:secret});
})

app.post('/delegate/hash/',async (req,res) => {

    let secret = req.body["secret"];
    let hash = await zklib.get_hash(secret);
    console.log(hash);
    res.json({hash:hash});
})

app.post('/delegate/proof/',async (req,res) => {

    let secret = req.body["secret"];
    let secret_hash = req.body["secret_hash"];
    let proof = await zklib.generate_secret_proof(secret, secret_hash);
    res.json(proof);

})

app.post("/delegate/verify", async (req, res) => {

    let secret_proof = req.body["proof"];
    console.log(secret_proof);
    await getContracts();
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log(secretVerifier.methods);
    var result  = await secretVerifier.methods.verifyTx(secret_proof["proof"]["a"],secret_proof["proof"]["b"],secret_proof["proof"]["c"],secret_proof["inputs"])
    .call({from:accounts[0],gas:600000 });
    console.log(result);
    res.json(result);
})

async function getContracts() {
    console.log("Retrieving contract information...")
    let chainId = await web3.eth.net.getId()
    secretVerifier = new web3.eth.Contract(secretVerifier.abi, secretVerifier["networks"][chainId.toString()]["address"]);
}


app.listen(3000, () =>{
    console.log(`Server started.`)
})

