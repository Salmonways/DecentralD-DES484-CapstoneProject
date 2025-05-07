 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CredentialRegistry {
    address public owner;

    struct Credential {
        string credentialID;
        address issuer;
        uint256 timestamp;
        bool valid;
        bool exists;
    }

    mapping(bytes32 => Credential) public credentials;

    event CredentialRegistered(string credentialID, address indexed issuer, uint256 timestamp);
    event CredentialRevoked(string credentialID, address indexed issuer, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function registerCredential(string memory _credentialID) public {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        require(!credentials[hash].exists, "Credential already registered");

        credentials[hash] = Credential({
            credentialID: _credentialID,
            issuer: msg.sender,
            timestamp: block.timestamp,
            valid: true,
            exists: true
        });

        emit CredentialRegistered(_credentialID, msg.sender, block.timestamp);
    }

    function revokeCredential(string memory _credentialID) public {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        require(credentials[hash].exists, "Credential does not exist");
        require(credentials[hash].valid, "Credential already revoked");

        credentials[hash].valid = false;

        emit CredentialRevoked(_credentialID, msg.sender, block.timestamp);
    }

    function isCredentialValid(string memory _credentialID) public view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        return credentials[hash].exists && credentials[hash].valid;
    }

    function getCredentialStatus(string memory _credentialID) public view returns (string memory) {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        if (!credentials[hash].exists) return "not found";
        return credentials[hash].valid ? "active" : "revoked";
    }

    function getCredentialInfo(string memory _credentialID) public view returns (Credential memory) {
        bytes32 hash = keccak256(abi.encodePacked(_credentialID));
        require(credentials[hash].exists, "Credential not found");
        return credentials[hash];
    }
}