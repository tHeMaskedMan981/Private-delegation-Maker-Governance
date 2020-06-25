// chief.sol - select an authority by consensus

// Copyright (C) 2017  DappHub, LLC

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity >=0.4.23;

import './tokengov.sol';
import './tokeniou.sol';
import './roles.sol';
import './thing.sol';
import './secretVerifier.sol';

// The right way to use this contract is probably to mix it with some kind
// of `DSAuthority`, like with `ds-roles`.
//   SEE DSChief
contract DSChiefApprovals is DSThing {
    mapping(bytes32=>address[]) public slates;
    mapping(address=>bytes32) public votes;
    mapping(address=>uint256) public approvals;
    mapping(address=>uint256) public deposits;
    mapping(address=>bytes32) public secretHash;

    SecretVerifier public verifier;
    DSTokenGOV public GOV; // voting token that gets locked up
    DSTokenIOU public IOU; // non-voting representation of a token, for e.g. secondary voting mechanisms
    address public hat; // the chieftain's hat
    address public verifierAddress;
    uint256 public MAX_YAYS;

    event Etch(bytes32 indexed slate);

    // IOU constructed outside this contract reduces deployment costs significantly
    // lock/free/vote are quite sensitive to token invariants. Caution is advised.
    constructor(DSTokenGOV GOV_, DSTokenIOU IOU_, uint MAX_YAYS_) public
    {
        GOV = GOV_;
        IOU = IOU_;
        MAX_YAYS = MAX_YAYS_;
    }

    // function can be used to set the address of the Proof verifier Contract
    function setVerifier(address _verifierAddress) public {
        verifierAddress = _verifierAddress;
        verifier = SecretVerifier(verifierAddress);
    }

    function setSecretHash(bytes32 _secretHash) public {
        secretHash[msg.sender] = _secretHash;
    }

    function lock(uint wad)
        public
        note
    {
        GOV.pull(msg.sender, wad);
        IOU.mint(msg.sender, wad);
        deposits[msg.sender] = add(deposits[msg.sender], wad);
        addWeight(wad, votes[msg.sender]);
    }

    function free(uint wad)
        public
        note
    {
        deposits[msg.sender] = sub(deposits[msg.sender], wad);
        subWeight(wad, votes[msg.sender]);
        IOU.burn(msg.sender, wad);
        GOV.push(msg.sender, wad);
    }

    function etch(address[] memory yays)
        public
        note
        returns (bytes32 slate)
    {
        require( yays.length <= MAX_YAYS );
        requireByteOrderedSet(yays);
        
        bytes32 hash = keccak256(abi.encodePacked(yays));
        slates[hash] = yays;
        emit Etch(hash);
        return hash;
    }

    function vote(address[] memory yays) public returns (bytes32)
        // note  both sub-calls note
    {
        bytes32 slate = etch(yays);
        vote(slate);
        return slate;
    }

    function vote(bytes32 slate)
        public
        note
    {
        require(slates[slate].length > 0 ||
            slate == 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, "ds-chief-invalid-slate");
        uint weight = deposits[msg.sender];
        subWeight(weight, votes[msg.sender]);
        votes[msg.sender] = slate;
        addWeight(weight, votes[msg.sender]);
    }

    // function override, this vote function can be used by delegatee to vote on behalf of delegator
    function delegateVote(address[] memory yays, address voteProxy, uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input
        ) public returns (bytes32)
        // note  both sub-calls note
    {

        bytes32 slate = etch(yays);
        delegateVote(slate, voteProxy, a, b, c, input);
        return slate;
    }
    // function override. this function can be used by the delegatee to vote on behalf of delegator directly
    // using slate
    function delegateVote(bytes32 slate, address voteProxy, uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input)
        public
        note
    {
        require(slates[slate].length > 0 ||
            slate == 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470, "ds-chief-invalid-slate");
        
        require(checkInput(voteProxy, input[0], input[1]), "The proof doesn't correspond to the delegator");
        require(verifier.verifyTx(a, b, c, input), "The proof is not valid");
        uint weight = deposits[voteProxy];
        subWeight(weight, votes[voteProxy]);
        votes[voteProxy] = slate;
        addWeight(weight, votes[voteProxy]);
    }

    // This function makes sure the proof is generated by the delegator itself. Not checking this might result
    // in generation of fake proofs.
    function checkInput(address voteProxy,uint input1, uint input2) public view returns (bool) {

        uint a = input1 * 2**128;
        uint c = a | input2;
        if (bytes32(c)==secretHash[voteProxy]){
            return true;
        }
        else{
            return false;
        }
    }
    // like `drop`/`swap` except simply "elect this address if it is higher than current hat"
    function lift(address whom)
        public
        note
    {
        require(approvals[whom] > approvals[hat]);
        hat = whom;
    }

    function addWeight(uint weight, bytes32 slate)
        internal
    {
        address[] storage yays = slates[slate];
        for( uint i = 0; i < yays.length; i++) {
            approvals[yays[i]] = add(approvals[yays[i]], weight);
        }
    }

    function subWeight(uint weight, bytes32 slate)
        internal
    {
        address[] storage yays = slates[slate];
        for( uint i = 0; i < yays.length; i++) {
            approvals[yays[i]] = sub(approvals[yays[i]], weight);
        }
    }

    // Throws unless the array of addresses is a ordered set.
    function requireByteOrderedSet(address[] memory yays)
        internal
        pure
    {
        if( yays.length == 0 || yays.length == 1 ) {
            return;
        }
        for( uint i = 0; i < yays.length - 1; i++ ) {
            // strict inequality ensures both ordering and uniqueness
            require(uint(yays[i]) < uint(yays[i+1]));
        }
    }
}


// `hat` address is unique root user (has every role) and the
// unique owner of role 0 (typically 'sys' or 'internal')
contract DSChief is DSRoles, DSChiefApprovals {

    constructor(DSTokenGOV GOV, DSTokenIOU IOU, uint MAX_YAYS)
             DSChiefApprovals (GOV, IOU, MAX_YAYS)
        public
    {
        authority = this;
        owner = address(0);
    }

    // function setOwner(address owner_) public {
    //     owner_;
    //     revert();
    // }

    // function setAuthority(DSAuthority authority_) public {
    //     authority_;
    //     revert();
    // }

    // function isUserRoot(address who)
    //     public view
    //     returns (bool)
    // {
    //     return (who == hat);
    // }
    // function setRootUser(address who, bool enabled) public {
    //     who; enabled;
    //     revert();
    // }
}

// contract DSChiefFab {
//     function newChief(DSToken gov, uint MAX_YAYS) public returns (DSChief chief) {
//         DSToken iou = new DSToken('IOU');
//         chief = new DSChief(gov, iou, MAX_YAYS);
//         iou.setOwner(address(chief));
//     }
