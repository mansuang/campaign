const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

const { receiveMessageOnPort } = require("worker_threads");
const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;
// const should = chai.should;

contract("Campaign factory Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    // beforeEach( async() => {
    //     // this.myToken = await Token.new(process.env.INITIAL_TOKENS);

    // });

    it("can deploy campaign", async () =>{
        let factoryInstance = await CampaignFactory.new();
        await factoryInstance.createCampaign(100);
        await factoryInstance.createCampaign(0);

        let campaignAddresses = await factoryInstance.getDeployedCampaigns();

        console.log( campaignAddresses );

        let campaign1 = await Campaign.at(campaignAddresses[0])
        // await campaign1.contribute({from:deploymentAccount, value: 101});

        expect( campaign1.contribute({from:deploymentAccount, value: 101})).to.eventually.be.fulfilled;

        // console.log( await web3.eth.getBalance(campaignAddresses[0]) );
        // console.log( await web3.eth.getBalance(campaignAddresses[1]) );
    });

});