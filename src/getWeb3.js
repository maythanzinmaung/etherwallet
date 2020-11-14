let Web3 = require('web3');
let web3 = new Web3();

// set the local provider of block chain
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8080'));