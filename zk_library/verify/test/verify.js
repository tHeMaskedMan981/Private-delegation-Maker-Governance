
const SecretVerifier = artifacts.require('SecretVerifier');
const Secret_proof = require("../../get_proof/proof.json");
const Web3 = require('web3')
var web3 = new Web3();  
const BigNumber = require('bignumber.js');

// console.log(proof);
contract('SecretVerifier', (accounts) => {
    let SecretVerifierInstance;
    let creator;


    before(async () => {
        SecretVerifierInstance = await SecretVerifier.deployed();
        
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