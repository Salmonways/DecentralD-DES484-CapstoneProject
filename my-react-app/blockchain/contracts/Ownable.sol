// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


/* ======================= Ownable.sol ======================= */
abstract contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
