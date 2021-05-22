const Campaign = artifacts.require("Campaign");

const { receiveMessageOnPort } = require("worker_threads");
const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;
// const should = chai.should;

contract("Campaign Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    // beforeEach( async() => {
    //     // this.myToken = await Token.new(process.env.INITIAL_TOKENS);

    // });

    it("can contribute when value greater than minimum", async () =>{
        let campaignInstance = await Campaign.deployed();

        expect( campaignInstance.contribute({from:deploymentAccount, value: 101})).to.eventually.be.fulfilled;

        // console.log( await web3.eth.getBalance(campaignInstance.address));
    });

    it("could not contribute value less than minimum", async ()=>{
        let campaignInstance = await Campaign.deployed();

        expect(campaignInstance.contribute({from:deploymentAccount, value: 1}) ).to.eventually.be.rejected;
    });

    it("can create requests and vote only once", async ()=>{
        let campaignInstance = await Campaign.deployed();

        // console.log(campaignInstance.requests);
        // expect(campaignInstance.contribute({from:deploymentAccount, value: 1}) ).to.eventually.be.fulfilled;
        expect( campaignInstance.createRequest("Buy batteries", web3.utils.toWei("2","ether"),recipient) ).to.eventually.be.fulfilled;
        // console.log(await campaignInstance.numRequests);

        expect(campaignInstance.getDescription(0) ).to.eventually.equals("Buy batteries")
        expect(await campaignInstance.getApprovalsCount(0) ).to.be.a.bignumber.equal(new BN(0))
        // console.log( await web3.eth.getBalance(deploymentAccount));
        // await campaignInstance.approveRequest(0);
        expect( campaignInstance.approveRequest(0, {from: deploymentAccount} )).to.eventually.be.fulfilled;
        expect(await campaignInstance.getApprovalsCount(0) ).to.be.a.bignumber.equal(new BN(1))
        // console.log(await campaignInstance.getApprovalsCount(0));

        // allow only vote 1 time
        expect( campaignInstance.approveRequest(0) ).to.eventually.be.rejected;

    });

    it("only contribute person is allowed to vote", async () => {
        let campaignInstance = await Campaign.deployed();

        // console.log(campaignInstance.requests);
        // expect(campaignInstance.contribute({from:deploymentAccount, value: 1}) ).to.eventually.be.fulfilled;
        expect( campaignInstance.createRequest("Buy batteries", web3.utils.toWei("1","ether"),deploymentAccount) ).to.eventually.be.fulfilled;
        // console.log(await campaignInstance.numRequests);

        expect( campaignInstance.approveRequest(0, {from: anotherAccount} )).to.eventually.be.rejected;    
    });

    it("can not finalize the vote when the vote less than 50%", async () => {
        let campaignInstance = await Campaign.deployed();

        await campaignInstance.contribute({from:deploymentAccount, value: web3.utils.toWei("2","ether")});
        expect( campaignInstance.createRequest("Buy batteries", web3.utils.toWei("2","ether"),recipient) ).to.eventually.be.fulfilled;

        expect( campaignInstance.finalizeRequest(0)).to.eventually.be.rejected;    
    });

    it("can finalize the request and transfer to recepient", async () => {
        let campaignInstance = await Campaign.new(100);
        

        await campaignInstance.contribute({from: deploymentAccount, value: web3.utils.toWei("3","ether")});
        expect( campaignInstance.createRequest("Buy batteries2", web3.utils.toWei("2","ether"),recipient) ).to.eventually.be.fulfilled;
        
        console.log(await campaignInstance.getDescription(0));

        console.log( await web3.eth.getBalance(recipient));

        expect( campaignInstance.approveRequest(0, {from: deploymentAccount} )).to.eventually.be.fulfilled;
        // expect( campaignInstance.finalizeRequest(0)).to.eventually.be.fulfilled;   
        await campaignInstance.finalizeRequest(0);
        console.log( await web3.eth.getBalance(recipient));
        // await campaignInstance.finalizeRequest(0); 
        // expect( campaignInstance.finalizeRequest(0)).to.eventually.be.fulfilled;   
    });
});