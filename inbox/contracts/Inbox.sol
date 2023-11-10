pragma solidity ^0.4.17;

contract Inbox
{   
    string public message;

    function Inbox(string initMessage) public 
    {
        message = initMessage;
    }

    function setMessage(string newMessage) public
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

}