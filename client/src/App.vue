<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Your address is: {{ accounts[0] }}</h2>
    <h2>Value: {{ storageValue }}</h2>
    <button type="button" @click="send">Send</button>
    
  </div>
</template>

<script>
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";



export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      accounts: [],
      balance: null,
      contract: null,
      storageValue: 0
    }
  },
  methods: {
    async send() {

      // Stores a given value, 5 by default.
      await this.contract.methods.set(5).send({ from: this.accounts[0] });

      // Get the value from the contract to prove it worked.
      this.storageValue = await this.contract.methods.get().call();
    },
    async getBalance(address) {
      this.balance = await web3.eth.getBalance(address);
      console.log('balance', this.balance);
    },
    async init() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        // this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        this.contract = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
  },
  created() {
    this.init();
    // this.getBalance(this.accounts[0]);
    window.ethereum.on('accountsChanged',  (accounts) => {
      this.accounts = accounts;
      // this.getBalance(accounts[0]);
    })
    
    window.ethereum.on('chainChanged',  (accounts) => {
      window.location.reload();
    })
  },
  mounted() {
    console.log('mounted!')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
