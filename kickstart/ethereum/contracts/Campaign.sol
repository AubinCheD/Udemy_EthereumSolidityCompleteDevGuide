// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
// import "hardhat/console.sol";

contract CampaignFactory
{
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public payable 
    {
        Campaign newCampaign = new Campaign(minimumContribution, msg.sender);
        address newAddress = address(newCampaign);
        deployedCampaigns.push(newAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory)
    {
        return deployedCampaigns; 
    }
}




contract Campaign
{   
    struct Request
    {
        string description;
        uint amount; //transactionPriceInEth;
        address recipient; //address the money will be sent to
        bool completed; //true if transaction has already been made
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    mapping(address => bool)  public approvers;
    uint public approversCount;
    uint minimumContributionInEth;
    Request[] public requests;

    modifier restricted()
    {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minContributionInEth, address creator) 
    {
        //manager = msg.sender;
        manager = creator;
        minimumContributionInEth = minContributionInEth;
    }

    function contribute() public payable
    {
        require(msg.value > minimumContributionInEth); // 0.1ETH <=> 1000000000000000000 Wei

        approvers[msg.sender] = true;
        approversCount ++;
    }

    function createRequest(string calldata description, uint amount, address recipient) public restricted
    {
        //not working anymore

        // Request memory newRequest = Request(
        //     {
        //         description: description,
        //         amount: amount,
        //         recipient: recipient,
        //         completed: false,
        //         //approvals:  ,// no need to instanciate reference types
        //         approvalCount: 0
        //     }
        // );

        //Request(description, recipient, value, false, false); //other syntax

        //requests.push(newRequest);



        //working version
        uint numRequest = requests.length;

        requests.push();

        Request storage newRequest = requests[numRequest];
        newRequest.description = description;
        newRequest.amount = amount;
        newRequest.recipient = recipient;
        newRequest.completed = false;
        newRequest.approvalCount = 0;


    }

    function approveRequest(uint requestIndex) public 
    {
        require(approvers[msg.sender]);
        require(!requests[requestIndex].approvals[msg.sender]);

        requests[requestIndex].approvals[msg.sender] = true;
        requests[requestIndex].approvalCount ++;
    }

    function finalizeRequest(uint requestIndex) public restricted
    {
        Request storage request = requests[requestIndex]; //reference to the request (not a copy !)

        require(!request.completed);
        require(request.approvalCount > (approversCount / 2) );

        request.completed = true;

        payable(request.recipient).transfer(request.amount);
    }

}