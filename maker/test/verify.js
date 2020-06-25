
const DSChief = artifacts.require('DSChief');
const VoteProxy = artifacts.require('VoteProxy');
const DSTokenGOV = artifacts.require('DSTokenGOV');
const DSTokenIOU = artifacts.require('DSTokenIOU');
const SecretVerifier = artifacts.require('SecretVerifier');

const Web3 = require('web3')
const secret_proof = require("../../zk_library/get_proof/proof.json");
var web3 = new Web3();  
const BigNumber = require('bignumber.js');

contract('DSChief', (accounts) => {
    let DSChiefInstance, VoteProxyInstance, DSTokenGOVInstance, DSTokenIOUInstance, SecretVerifierInstance;
    let voter = accounts[0];


    before(async () => {
        DSChiefInstance = await DSChief.deployed();
        VoteProxyInstance = await VoteProxy.deployed();
        DSTokenGOVInstance = await DSTokenGOV.deployed();
        DSTokenIOUInstance = await DSTokenIOU.deployed();
        SecretVerifierInstance = await SecretVerifier.deployed();
    })

    it('should be able to deploy', async () => {

    });

    // as dont have MKR tokens by default. Normally in production this wont be used 
    it("should mint gov correctly", async () => {

        await DSTokenGOVInstance.mint(accounts[0], 10000, {from:voter, gas: 4000000});
        console.log(BigNumber(await DSTokenGOVInstance._balances.call(accounts[0])).toFixed() );
    });

    // Locking via the VoteProxy contract. therefore in the chief contract, deposits etc are being stored 
    // wrt the voteProxy contract address, not the voter's address
    it("should lock gov correctly", async () => {
        await DSTokenGOVInstance.approve(VoteProxyInstance.address, 4000000, {from:voter});
        await VoteProxyInstance.lock(800, {from:voter, gas: 4000000});
        console.log("deposit locked MKR : ", BigNumber(await DSChiefInstance.deposits.call(VoteProxyInstance.address)).toFixed());
        
    });
    
    // yays define the list of options selected in approval voting. slates is a unique identifier for a set of 
    // choices. For simplicity, we have kept just one choice in yays array. I think candidate is a contract, 
    // that's why it is storing addresses, so abstracting that part, I just used extra ganache addresses for voting
    it("should add slates and yays correctly", async () => {
        
        let slate5 = await DSChiefInstance.etch.call([accounts[5]] , {from:voter});
        console.log("slate 5 : ", slate5);
        await DSChiefInstance.etch([accounts[5]] , {from:voter});
        await DSChiefInstance.etch([accounts[6]] , {from:voter});
        await DSChiefInstance.etch([accounts[7]] , {from:voter});
        await DSChiefInstance.etch([accounts[8]] , {from:voter});

        console.log("yays stored in contract : ", await DSChiefInstance.slates.call(slate5, 0), accounts[5]);


    });

    // Basic voting by the normal voter, through the voteProxy contract. works like it does in Maker right now 
    it("should vote correctly", async () => {
        await VoteProxyInstance.vote([accounts[5]], {from:voter, gas: 4000000});
        console.log("approval votes for account 5 : ",BigNumber(await DSChiefInstance.approvals.call(accounts[5])).toFixed()  );

    });

    
    // When the person wants to delegate, he can store a secret Hash in the voteProxy contract, and it is also 
    // stored in the chief.sol contract. It makes verification easier. 
    it("should add secret hash correctly", async () => {
        const secret_hash = "0xc33be47cb71b2f69e60d596125550419b66857e3d3b2a12542e65b54a4637e72";
        await VoteProxyInstance.setSecret(secret_hash, {from:voter, gas: 4000000});
        console.log("secret hash in dschief contract : ",  await DSChiefInstance.secretHash.call(VoteProxyInstance.address));

    });

    // Adding the address of the zksnarks verifier contract. will be used for verification of delegatee vote.
    it("should add verifier contract correctly", async () => {

        DSChiefInstance.setVerifier(SecretVerifierInstance.address, {from:accounts[0], gas: 4000000});
        
    });
    // Delegated voting. The delegatee submits the zk-proof for the preimage, where the secret hash provided 
    // in the public inputs is also verified from the secret hash stored in the chief contract. The delegatee 
    // also submits the address of the vote proxy contract of the delegator, as that is used for referring and 
    // storing any votes or deposits or secret Hash.  
    it("delegatee should vote correctly", async () => {
        console.log(secret_proof);
        console.log("votes for account 5 : ",BigNumber(await DSChiefInstance.approvals.call(accounts[5])).toFixed()  );
        console.log("votes for account 6 : ",BigNumber(await DSChiefInstance.approvals.call(accounts[6])).toFixed()  );
        let slate = await DSChiefInstance.delegateVote([accounts[6]], VoteProxyInstance.address, secret_proof["proof"]["a"],secret_proof["proof"]["b"],secret_proof["proof"]["c"],secret_proof["inputs"], {from:accounts[3], gas: 4000000});

        console.log("votes for account 5 : ",BigNumber(await DSChiefInstance.approvals.call(accounts[5])).toFixed()  );
        console.log("votes for account 6 : ",BigNumber(await DSChiefInstance.approvals.call(accounts[6])).toFixed()  );
        
    });

    
   
})