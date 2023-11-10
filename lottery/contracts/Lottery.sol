// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "hardhat/console.sol";

contract Lottery
{   
    address public manager;
    address[] public players;

    constructor() 
    {
        manager = msg.sender;
    }

    function getNumber() public pure returns (int256)
    {
        return 123456789;
    }

    function enter() public payable
    {
        require(msg.value > .01 ether, "requires to pay min .01 ether"); // 0.1ETH <=> 1000000000000000000 Wei

        //if(!players.contains(msg.sender))
        players.push(msg.sender);
    }

    function pickWinner() public
    {
        require(msg.sender == manager, "requires to be manager");

        address winner = players[random()];
        // console.log(winner);
        payable(winner).transfer(address(this).balance);

        reset();
    }

    function pickWinner_V2() public restricted
    {
        address winner = players[random()];
        // console.log(winner);
        payable(winner).transfer(address(this).balance);

        reset();
    }

    function getPlayers() public view returns (address[] memory)
    {
        return players;
    }

    modifier restricted()
    {
        require(msg.sender == manager, "requires to be manager");
        _;
    }


    function random() private view returns (uint)
    {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) % players.length;
    }

    function reset() private 
    {
        //while(players.length>0) {players.pop();}
        players = new address[](0);
    }
}