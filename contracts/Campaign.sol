// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.4;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address =>bool) public approvers;

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
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false
        });

        requests.push(newRequest);
    }
}