// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    address public owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) public domains;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    // List Domains
    function list(string memory _name, uint256 _cost) public {
        // Save the Domain
        domains[1] = Domain({name: _name, cost: _cost, isOwned: false});

        // Update Total Domain Count
    }
}
