var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Campaign = artifacts.require("./Campaign.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Campaign, 100);
};
