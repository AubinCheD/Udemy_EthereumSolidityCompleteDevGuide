const ganache = require('ganache');
const { Web3 } = require('web3');

const assert = require('assert');
const { beforeEach } = require('mocha');

const web3 = new Web3(ganache.provider());
//const { interface, bytecode } = require('../compile') //old
const { abi, evm } = require('../compile') //new

const INITIAL_STRING = 'Hi There !' ;
// updated ganache and web3 imports added for convenience

// contract test code will go here

let accounts;
let lottery;

beforeEach(async () => 
    {
        //get a list of all accounts
        accounts = await web3.eth.getAccounts()
        
        // web3.eth.getAccounts().then(fetchedAccounts => {
        //     console.log(fetchedAccounts);
        // });

        //use one of the accounts to deploy the contract
        // lottery = await new web3.eth.Contract(abi)
        //     .deploy({data: evm.bytecode.object})
        //     .send({from: accounts[0], gas: '1000000'});
    }
);


describe('Lottery', () => {
    // it('deploys a contract', () => {
    //     //console.log(inbox);
    //     assert.ok(inbox.options.address);
    // });
    // it('has a default message', async () => {
    //     const msg = await inbox.methods.message().call();
    //     assert.equal(msg, INITIAL_STRING);
    // });
    // it('can change the message', async () => {
    //     const newMessage = 'My new message'
    //     await inbox.methods.setMessage(newMessage).send({from: accounts[0]});
    //     const newMsgReceived = await inbox.methods.message().call();
    //     assert.equal(newMessage, newMsgReceived);
    // });
});