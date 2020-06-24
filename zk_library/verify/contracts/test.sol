pragma solidity ^0.5.0;

import './secretVerifier.sol';

contract Test {
  address public verifier;
  SecretVerifier verifierContract;

  constructor(address _verifier) public {
    verifier = _verifier;
    verifierContract = SecretVerifier(verifier);
  }

  function verify(uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input) public returns (bool) {
    
    return verifierContract.verifyTx(a, b, c, input);

  }
}