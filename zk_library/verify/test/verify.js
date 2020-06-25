
const SecretVerifier = artifacts.require('SecretVerifier');
const Test = artifacts.require('Test');
const Secret_proof = require("../../get_proof/proof.json");
const Web3 = require('web3')
var web3 = new Web3();  
const BigNumber = require('bignumber.js');

// console.log(proof);
contract('SecretVerifier', (accounts) => {
    let SecretVerifierInstance, TestInstance;
    let creator;


    before(async () => {
        SecretVerifierInstance = await SecretVerifier.deployed();
        TestInstance = await Test.deployed();
    })

    it('should be able to deploy', async () => {

        // assert.equal(dummy, 1, "not deployed correctly");
        // assert.notEqual(CompoundDAIMarketInstance.address, "0x0000000000000000000000000000000000000000");
    });


    
    
    // it("should verify age correctly", async () => {

    //     // console.log(age_proof);
    //     verification_status = await AgeVerifierInstance.verifyTx.call(age_proof["proof"]["a"],age_proof["proof"]["b"],age_proof["proof"]["c"],age_proof["inputs"], {from:accounts[0], gas: 4000000});
    //     console.log(verification_status);
    //     // console.log(verification_status["logs"]);
        
    // });
    
    it("should verify Secret correctly", async () => {

        console.log(Secret_proof);
        verification_status = await SecretVerifierInstance.verifyTx.call(Secret_proof["proof"]["a"],Secret_proof["proof"]["b"],Secret_proof["proof"]["c"],Secret_proof["inputs"], {from:accounts[0], gas: 4000000});
        console.log(verification_status);
        // console.log(verification_status["logs"]);   
    });

    it("should verify Secret correctly from test contract", async () => {

        console.log(Secret_proof);
        verification_status = await TestInstance.verify.call(Secret_proof["proof"]["a"],Secret_proof["proof"]["b"],Secret_proof["proof"]["c"],Secret_proof["inputs"], {from:accounts[0], gas: 4000000});
        console.log(verification_status);
        // console.log(verification_status["logs"]);   
    });

    it("should check secret hash correctly", async () => {
        let hash = "0x" + "c33be47cb71b2f69e60d596125550419b66857e3d3b2a12542e65b54a4637e72";
        console.log(hash, Secret_proof["inputs"][0], Secret_proof["inputs"][1]);
        await TestInstance.store(hash, {from:accounts[0], gas: 4000000});
        console.log("in the contract : ",  await TestInstance.secret.call());
        verification_status = await TestInstance.check.call(Secret_proof["inputs"][0], Secret_proof["inputs"][1], {from:accounts[0], gas: 4000000});
        console.log(verification_status);

        let secret = await TestInstance.secret.call();
        let secret2 = await TestInstance.secret2.call();

        console.log("secrets : \n", secret, "\n", secret2, "\n", BigNumber(secret2).toFixed());
        // console.log(verification_status["logs"]);   
    });

    // it("should verify voter eligibility correctly", async () => {

    //     let Secret = "secure voting key";
    //     let commitment_hex = web3.utils.keccak256(Secret);
    //     console.log("commitment hash : ", commitment_hex);
    //     let x1 = BigNumber(commitment_hex.substr(0,8), 16).toFixed();
    //     console.log("final commitment : ", x1);
    //     let receipt = await ElectionInstance.addCommitment(x1 , {from:accounts[0], gas: 4000000});
    //     let receipt1 = await ElectionInstance.addCommitment(x1 , {from:accounts[0], gas: 4000000});
    //     let receipt2 = await ElectionInstance.addCommitment(x1 , {from:accounts[0], gas: 4000000});
    //     // console.log(receipt);

    //     let commitments = await ElectionInstance.getCommitments.call();
    //     let input_proof = [];
    //     for(i=0; i<3; i++){
    //         let x =  new BigNumber(commitments[0]).toFixed();
    //         input_proof.push(x);
    //     }
    //     console.log("commitments : ", new BigNumber(commitments[0]).toFixed());
    //     console.log("input proof: ", input_proof);
         
    // });

    
   
})