const execSync = require('child_process').execSync;
const fs = require("fs");
const BigNumber = require('bignumber.js');
const { exec } = require('child_process');
var crypto = require('crypto')

function randomValueHex(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, len) // return required number of characters
}

function get_secret(){
    return randomValueHex(64);
}

async function generate_secret_proof(secret, secret_hash){

    let secret1 = BigNumber(secret.substr(0,32), 16).toFixed();
    let secret2 = BigNumber(secret.substr(32,32), 16).toFixed();
    
    let x1 = BigNumber(secret_hash.substr(0,32), 16).toFixed();
    let x2 = BigNumber(secret_hash.substr(32,32), 16).toFixed();

    let compute_witness_command = 'zokrates compute-witness -a ' + String(secret1) + ' ' + String(secret2) + ' ' + (x1) + ' ' + (x2);
    console.log(compute_witness_command);
    execSync(compute_witness_command, {cwd: './get_proof', encoding: 'utf-8', maxBuffer:10000*1024 });

    let generate_proof_command = 'zokrates generate-proof';
    execSync(generate_proof_command, {cwd: './get_proof', encoding: 'utf-8', maxBuffer:10000*1024 });
    let proof = require("./get_proof/proof.json");
   
    return proof;
}

async function get_hash(secret){

    let secret1 = BigNumber(secret.substr(0,32), 16).toFixed();
    let secret2 = BigNumber(secret.substr(32,32), 16).toFixed();

    let compute_witness_command = 'zokrates compute-witness -a ' + String(secret1) + ' ' + String(secret2);
    console.log(compute_witness_command);
    const output = execSync(compute_witness_command, {cwd: './get_hash', encoding: 'utf-8', maxBuffer: 10000*1024});
    let command1 = "grep '~out_0' witness";
    let command2 = "grep '~out_1' witness";
    const output1 = execSync(command1, {cwd: './get_hash', encoding: 'utf-8' });
    const output2 = execSync(command2, {cwd: './get_hash', encoding: 'utf-8' });
    console.log(output1, " ", output2);
    let out0 = BigNumber(output1.split(" ")[1]).toString(16);
    let out1 = BigNumber(output2.split(" ")[1]).toString(16);
    let finalHash = out0 + out1;
    // console.log("here", finalHash);
    return finalHash;
    
}



async function main(){

    let start = Date.now();
    let secret = get_secret();
    let hash = await get_hash(secret);
    console.log(hash);
    
    let secret_proof = await generate_secret_proof(secret, hash);
    console.log(JSON.stringify(secret_proof), "\n");
    // let proofbase64 = Buffer.from(JSON.stringify(secret_proof)).toString('base64');
    // console.log(proofbase64, "\n");
    // let proof = Buffer.from(proofbase64, 'base64').toString('binary')
    let end = Date.now();
    // console.log(proof);
    console.log ("\n\ntime taken : ", (end-start)/1000, " seconds. ");
}

// main()

module.exports = {

    generate_secret_proof,
    get_hash,
    get_secret

}