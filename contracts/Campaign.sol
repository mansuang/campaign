// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.4;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address =>bool) public approvers;
    uint numRequests;
    mapping (uint => Request) requests;

    modifier restricted() {
        require(msg.sender == manager, "Only manager allowed");
        _;
    }

    constructor(uint256 minimum) public {
        manager = msg.sender;
        minimumContribution = minimum;
    } 

    function contribute() public payable {
        require(msg.value > minimumContribution, "Value must greater than minumum contribution" );

        approvers[msg.sender] = true;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Not contributor");
        require(!request.approvals[msg.sender],"not have this contract");

        request.approvals[msg.sender] = true;
        request.approvalsCount++;


    }
}