const ganache = require('ganache');
//const { Web3 } = require('web3'); //v4.x
const Web3 = require('web3'); //v1.x

const assert = require('assert');
const { beforeEach } = require('mocha');

const web3 = new Web3(ganache.provider());

//const { abi, evm } = require('../compile');

const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => 
    {
        console.log('\n\nabi\n', compiledCampaignFactory.abi);

        console.log('\n\nbytecode\n', compiledCampaignFactory.evm.bytecode);

        console.log('\n\nbytecode.object\n', compiledCampaignFactory.evm.bytecode.object);

        accounts = await web3.eth.getAccounts();
        factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
            .deploy({data: compiledCampaignFactory.evm.bytecode.object})
            .send({from: accounts[0], gas: '10000000'});

        await factory.methods.createCampaign('100').send({from: accounts[0], gas: '1000000'}); //100 Wei

        //first Way to do it : 
        // const addresses = await factory.methods.getDeployedCampaigns().call();
        // camppaignAddress = addresses[0];

        //equivalent to 
        [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

        campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);


    }
);

describe('Campaign', () => 
    {
        it('deploys a campaign factory', () => {
            assert.ok(factory.options.address);
        });

        it('deploys a campaign', () => {
            assert.ok(campaign.options.address);
        });

        it('check campaign manager set correctly', async () => {
            manager = await campaign.methods.manager().call();
            assert.equal(manager, accounts[0]);
        });

        it('allows people to contribute money and marks them as approvers', async () => {
            await campaign.methods.contribute().send({from: accounts[1], value: '200', gas: '1000000'});
            isContributor = await campaign.methods.approvers(accounts[1]).call(); //will return approvers[accounts[1]]
            assert.equal(isContributor, true);
        });

        it('requires a minimum contribution', async () => {
            try
            {
                await campaign.methods.contribute().send({from: accounts[1], value: '0', gas: '1000000'});
                assert(false);
            }
            catch(err)
            {
                assert(err);
            }
        });

        it('allows manager to make a payment request', async () => {
            await campaign.methods.createRequest("buy1", '200', accounts[3]).send({from: accounts[0], gas: '1000000'});
            request = await campaign.methods.requests(0).call(); //will return requests[0]
            assert.equal(request.description, "buy1");
        });

        it('processes request from start to finish', async () => {

            account5initialBalance = await web3.eth.getBalance(accounts[5]);

            //contributions
            await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei('10', 'ether'), gas: '1000000'});
            await campaign.methods.contribute().send({from: accounts[2], value: web3.utils.toWei('10', 'ether'), gas: '1000000'});
            await campaign.methods.contribute().send({from: accounts[3], value: web3.utils.toWei('10', 'ether'), gas: '1000000'});
            await campaign.methods.contribute().send({from: accounts[4], value: web3.utils.toWei('10', 'ether'), gas: '1000000'});

            //Create request
            await campaign.methods.createRequest("buy1", web3.utils.toWei('5', 'ether'), accounts[5]).send({from: accounts[0], gas: '1000000'});

            //Approve request
            await campaign.methods.approveRequest(0).send({from: accounts[1], gas: '1000000'});
            await campaign.methods.approveRequest(0).send({from: accounts[2], gas: '1000000'});
            await campaign.methods.approveRequest(0).send({from: accounts[3], gas: '1000000'});

            //finalizeRequest
            await campaign.methods.finalizeRequest(0).send({from: accounts[0], gas: '1000000'});

            request = await campaign.methods.requests(0).call(); //will return requests[0]

            account5finalBalance = await web3.eth.getBalance(accounts[5]);

            assert(account5initialBalance < account5finalBalance);
            assert.equal(request.completed, true);
        });
    }
);