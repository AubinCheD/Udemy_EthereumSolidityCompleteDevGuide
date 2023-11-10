// compile code will go here
const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const inboxSource = fs.readFileSync(inboxPath, 'utf8')
const lotterySource = fs.readFileSync(lotteryPath, 'utf8')

const input = 
{
    language: 'Solidity',
    sources: 
    {
        'Inbox.sol': { content: inboxSource },
        // 'Lottery.sol': { content: lotterySource }
    },
    settings:
    {
        outputSelection:
        {
            '*':
            {
                '*': ['*']
            }
        }
    }
};

// console.log(solc.compile(source, 1));
//module.exports = solc.compile(source, 1).contracts[':Inbox']; //old version (<0.8.9)
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Inbox.sol'].Inbox; //new version