// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Inbox
{   
    string public message;

    constructor(string memory initMessage) 
    {
        message = initMessage;
    }

    function setMessage(string memory newMessage) public
    {
        message = newMessage;
    }

    function doMath(int a, int b) private pure
    {
        a+b;
        b-a;
        a*b;
        a==b;
    }

    function test() public payable returns (uint256)
    {
        require(msg.value > .001 ether, "requires to pay min .01 ether"); // 0.1ETH <=> 1000000000000000000 Wei

        return 123456789;
    }

}