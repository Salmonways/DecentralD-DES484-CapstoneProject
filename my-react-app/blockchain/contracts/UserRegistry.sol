// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Ownable.sol";

contract UserRegistry is Ownable {
    // Mapping from user address to an array of their DIDs
    mapping(address => string[]) private userDIDs;

    // Global mapping to track if a DID is already used
    mapping(string => bool) private didsSet;

    // Mapping from DID string to Ethereum address
    mapping(string => address) private didToAddress;

    // Event emitted when a new DID is registered
    event UserDIDRegistered(address indexed user, string did);

    // 🔍 Temporary debug event to log DID input
    event DIDRegisteredLog(string did);

    /// @notice Register a new DID for the sender's address
    /// @param did The DID string to register
    function registerUser(address user, string memory did) public onlyOwner {
        emit DIDRegisteredLog(did);

        require(bytes(did).length > 0, "DID must not be empty");
        require(!didsSet[did], string.concat("DID already registered: ", did));

        userDIDs[user].push(did);
        didsSet[did] = true;
        didToAddress[did] = user;

        emit UserDIDRegistered(user, did);
    }

    /// @notice Return all DIDs registered for a given user
    /// @param user The Ethereum address of the user
    /// @return An array of registered DIDs for the user
    function getDIDs(address user) external view returns (string[] memory) {
        return userDIDs[user];
    }

    /// @notice Check if a DID is globally registered
    /// @param did The DID string to check
    /// @return True if the DID is already registered
    function isDIDRegistered(string memory did) public view returns (bool) {
        return didsSet[did];
    }

    /// @notice Get the Ethereum address associated with a DID
    /// @param did The DID string to look up
    /// @return Ethereum address that registered the DID
    function getAddressFromDID(string memory did) public view returns (address) {
        return didToAddress[did];
    }
}