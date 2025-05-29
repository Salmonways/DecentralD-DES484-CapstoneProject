
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "./Ownable.sol";

contract RevocationRegistry is Ownable {
    event RevocationLogged(string credentialID, address indexed issuer, uint256 timestamp);

    function logRevocation(string memory credentialID, address issuer) external onlyOwner {
        emit RevocationLogged(credentialID, issuer, block.timestamp);
    }
}
