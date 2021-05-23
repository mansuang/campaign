var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Campaign = artifacts.require("./Campaign.sol");

module.exports = async (deployer) => {
  let addr = await web3.eth.getAccounts();

  await deployer.deploy(SimpleStorage);
  await deployer.deploy(Campaign, 100, addr[0]);
};
