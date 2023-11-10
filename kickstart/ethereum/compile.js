// compile code will go here
const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');
const util = require('util');    

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignSource = fs.readFileSync(campaignPath, 'utf8')


const input = 
{
    language: 'Solidity',
    sources: 
    {
        'Campaign.sol': { content: campaignSource }
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

// console.log('\n\ninput: \n', input);
// console.log('\n\nJSON.stringify(input): \n', JSON.stringify(input));
// console.log('\n\nJSON.parse(solc.compile(JSON.stringify(input))): \n', JSON.parse(solc.compile(JSON.stringify(input))));

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

//console.log('output: \n', output);
//console.log('output', util.inspect(output,false,null,true));

fs.ensureDirSync(buildPath);


for (let contract in output)
{
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        output[contract]
    );
}