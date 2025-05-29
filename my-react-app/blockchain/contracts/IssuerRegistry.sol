// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Ownable.sol";

contract IssuerRegistry is Ownable {
    mapping(address => bool) public registeredIssuers;
    mapping(string => address) public didToAddress; // NEW: DID → address mapping

    event IssuerAdded(address indexed issuer, string did);
    event IssuerRemoved(address indexed issuer);

    // Register issuer and map DID
    function registerIssuer(address issuer, string memory did) external onlyOwner {
        require(!registeredIssuers[issuer], "Already registered");
        require(didToAddress[did] == address(0), "DID already mapped");

        registeredIssuers[issuer] = true;
        didToAddress[did] = issuer;

        emit IssuerAdded(issuer, did);
    }

    function removeIssuer(address issuer) external onlyOwner {
        registeredIssuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    function isRegisteredIssuer(address issuer) public view returns (bool) {
        return registeredIssuers[issuer];
    }

    function getAddressFromDID(string memory did) public view returns (address) {
        return didToAddress[did];
    }
}