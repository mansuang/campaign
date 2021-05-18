const Campaign = artifacts.require("Campaign");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;
// const should = chai.should;

contract("Campaign Test", async (accounts) => {

    const [deploymentAccount, recipient, anotherAccount] = accounts;

    beforeEach( async() => {
        // this.myToken = await Token.new(process.env.INITIAL_TOKENS);

    });

    it("can contribute when value greater than minimum", async () =>{
        let campaignInstance = await Campaign.deployed();

        expect( campaignInstance.contribute({from:deploymentAccount, value: 101})).to.eventually.be.fulfilled;
    });

    it("could not contribute value less than minimum", async ()=>{
        let campaignInstance = await Campaign.deployed();

        expect(campaignInstance.contribute({from:deploymentAccount, value: 1}) ).to.eventually.be.rejected;
    });

});