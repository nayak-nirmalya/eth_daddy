// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    address public owner;
    uint256 public maxSupply;
    uint256 public totalSupply;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping(uint256 => Domain) domains;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner!");
        _;
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    // List Domain
    function list(string memory _name, uint256 _cost) public onlyOwner {
        maxSupply += 1;
        // Save the Domain
        domains[maxSupply] = Domain({name: _name, cost: _cost, isOwned: false});
    }

    // Buy Domain
    function mint(uint256 _id) public payable {
        require(_id != 0, "ID Can't be 0.");
        require(_id <= maxSupply, "Invalid ID!");
        require(domains[_id].isOwned == false, "Domain Already Owned!");
        require(msg.value == domains[_id].cost, "Not Enough ETH!");

        domains[_id].isOwned = true;
        totalSupply += 1;

        _safeMint(msg.sender, _id);
    }

    function getDomain(uint256 _id) public view returns (Domain memory) {
        return domains[_id];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
