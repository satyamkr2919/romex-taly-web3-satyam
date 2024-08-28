// contracts/Marketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Content {
        uint id;
        string title;
        string description;
        uint price;
        address payable owner;
        bool isSold;
    }

    uint public nextContentId;
    mapping(uint => Content) public contents;

    event ContentCreated(uint id, string title, string description, uint price, address owner);
    event ContentPurchased(uint id, address buyer);

    function createContent(string memory _title, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than 0");
        
        contents[nextContentId] = Content(nextContentId, _title, _description, _price, payable(msg.sender), false);
        emit ContentCreated(nextContentId, _title, _description, _price, msg.sender);
        
        nextContentId++;
    }

    function buyContent(uint _id) public payable {
        Content storage content = contents[_id];
        require(_id < nextContentId, "Content does not exist");
        require(msg.value >= content.price, "Not enough ETH sent");
        require(!content.isSold, "Content already sold");
        require(content.owner != msg.sender, "Cannot buy your own content");

        content.owner.transfer(msg.value);
        content.isSold = true;
        emit ContentPurchased(_id, msg.sender);
    }
}
