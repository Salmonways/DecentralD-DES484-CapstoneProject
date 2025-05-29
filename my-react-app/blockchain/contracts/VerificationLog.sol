// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationLog is Ownable {
    // Pass deployer (msg.sender) to Ownable constructor
    constructor() Ownable(msg.sender) {}

    event CredentialVerified(string credentialID, address verifier, uint256 timestamp, bool valid);

    function logVerification(string memory credentialID, address verifier, bool valid) external onlyOwner {
        emit CredentialVerified(credentialID, verifier, block.timestamp, valid);
    }
}