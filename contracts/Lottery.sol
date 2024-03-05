// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract Lottery{
    address public manager;
    address payable[] public players;
    uint index;

    constructor() public payable {
        manager=msg.sender;
    }

    function Enter() public payable {
        require(msg.value == 0.02 ether, "Must be 2 ether");

        players.push(msg.sender);
    }
//random number=
    function random() private view  returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));

    }
    function PickWinner() public restricted {
        index= random() % players.length;// this let it return number within the bound
        players[index].transfer(address(this).balance);
        players= new address payable[](0);

    }
    modifier restricted(){
        require(msg.sender == manager, "Not the Manager");
        _;
    }
    function getPlayers() public view returns( address payable [] memory){
        return players;
    }
}