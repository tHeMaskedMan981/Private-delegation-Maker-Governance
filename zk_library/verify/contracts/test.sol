pragma solidity ^0.5.0;

import './secretVerifier.sol';

contract Test {
  address public verifier;
  bytes32 public secret;
  uint public secret2;
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

  function store(uint256 _secret) public {
        secret = bytes32(_secret);
        secret2 = _secret;
    }


    function check(uint256 a, uint256 b) public view returns (bool){
        
        uint256 a1 = a * 2**128;
        uint256 c = a1 | b;
        if(bytes32(c)==secret){
            return true;
        }
        else{
            return false;
        }
    }
}

