const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
//updated web3 and hdwallet-provider imports added for convenience
const { interface, bytecode } = require('./compile')

const provider = new HDWalletProvider(
    'permit tool oak title verb caught sign dumb position normal soap only', //account mnemonic
    'https://sepolia.infura.io/v3/053019b5c9a2433dbcaa5ba44239ba51' //network address
);

const web3 = new Web3(provider);
const INITIAL_STRING = 'Hi There !' ;

// deploy code will go here
const deploy = async () => 
{
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_STRING]})
        .send({from: accounts[0], gas: '1000000'});

    console.log('Contract deployed to', inbox.options.address);

    //provider.engine.stop(); //to prevent a hanging deployemnt, add this code
};

deploy();