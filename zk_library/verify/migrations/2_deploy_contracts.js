const SecretVerifier = artifacts.require("SecretVerifier");

module.exports = function(deployer) {
  deployer.deploy(SecretVerifier);
};
