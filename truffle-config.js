const path = require("path");
require("dotenv").config({filename: "./.env"});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "nuxt/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.URI, AccountIndex);
      },
      network_id: 5777
    }
  }
};
