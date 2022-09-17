// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MessagePortal {
    // number of total messages
    uint256 totalMessages;

    // struct definition of a message
    struct Message {
        string text;
        address from;
        uint256 datetime;
    }
    // stores all messages
    Message[] allMessages;

    // counter of messages per user
    mapping(address => uint256) messagesPerUser;

    // event that it's sent to the front end
    event NewMessage(address indexed from, uint256 timestamp, string message);

    constructor() {
        console.log("Yayyy");
    }

    // saves message in the blockchain and updates counters
    function sendMessage(string memory _newMessage) public {
        console.log("%s has sent a message!", msg.sender);

        // saves message in array
        allMessages.push(Message(_newMessage, msg.sender, block.timestamp));

        // update counters
        totalMessages += 1;
        messagesPerUser[msg.sender] += 1;

        console.log(
            "Number of messages of %a %s >> ",
            msg.sender,
            messagesPerUser[msg.sender]
        );

        // emit event for web app
        emit NewMessage(msg.sender, block.timestamp, _newMessage);

        console.log("AllMessages updated");
    }

    // returns all messages
    function getAllMessages() public view returns (Message[] memory) {
        return allMessages;
    }

    // returns number of messages
    function getTotalMessages() public view returns (uint256) {
        console.log("We have %d total messages!", totalMessages);

        return totalMessages;
    }
}
