// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CredentialRegistry {
    address public owner;

    struct Credential {
        string credentialID;
        address issuer;
        uint256 timestamp;
        bool valid;
    }

    mapping(bytes32 => Credential) public credentials;

    event CredentialRegistered(string credentialID, address indexed issuer, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function registerCredential(string memory _credentialID) public {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        require(!credentials[hash].valid, "Credential already registered");

        credentials[hash] = Credential({
            credentialID: _credentialID,
            issuer: msg.sender,
            timestamp: block.timestamp,
            valid: true
        });

        emit CredentialRegistered(_credentialID, msg.sender, block.timestamp);
    }

    function isCredentialValid(string memory _credentialID) public view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        return credentials[hash].valid;
    }

    function getCredentialInfo(string memory _credentialID) public view returns (Credential memory) {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        require(credentials[hash].valid, "Credential not found");
        return credentials[hash];
    }
}