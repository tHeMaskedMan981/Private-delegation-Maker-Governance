const SecretVerifier = artifacts.require("SecretVerifier");
const Test = artifacts.require("Test");

module.exports = async function(deployer) {

  await deployer.deploy(SecretVerifier);
  const verifier = await SecretVerifier.deployed();
  await deployer.deploy(Test, verifier.address);
};
