// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.4;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minumum) public {
        address newCampaign = address(new Campaign(minumum, msg.sender));
        deployedCampaigns.push(newCampaign);

    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address =>bool) public approvers;
    uint numRequests;
    mapping (uint => Request) public requests;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only manager allowed");
        _;
    }

    constructor(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    } 

    function contribute() public payable {
        require(msg.value > minimumContribution, "Value must greater than minumum contribution" );

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable _recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = _recipient;
        r.complete = false;
        r.approvalsCount = 0;

        // console.log(r);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Not contributor");
        require(!request.approvals[msg.sender],"not have this contract");

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require( request.approvalsCount > (approversCount/2), "less than half are approve" );
        require(! request.complete, "request is already completed!" );

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getDescription(uint index) public view returns (string memory) {
        return requests[index].description;
    }
    function getApprovalsCount(uint index) public view returns (uint) {
        return requests[index].approvalsCount;
    }

}