const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider('https://rinkeby.infura.io');

function readContractInfoSync(path) {
    return JSON.parse(fs.readFileSync(path).toString());
}

const TestContractInfo = readContractInfoSync(path.join(__dirname, './build/contracts/Test.json'));

const test = new web3.eth.Contract(TestContractInfo.abi, '0xff9e5d94dc4205fa0a7dc6905f2eb42372431b0c');
test.getPastEvents("allEvents", {fromBlock:2345019, toBlock:2345019})
    .then(function(result) {
        assert.equal(result[0].logIndex, 2, 'first event logIndex 2');
        assert.equal(result[0].transactionIndex, 3, 'first event transactionIndex 3');

        assert.equal(result[1].logIndex, 3, 'second event logIndex 3');
        assert.equal(result[1].transactionIndex, 3, 'second event transactionIndex 3');

        assert.equal(result[2].logIndex, 4, 'third event logIndex 4');
        assert.equal(result[2].transactionIndex, 4, 'third event transactionIndex 4');

        assert.equal(result[3].logIndex, 5, 'fourth event logIndex 5');
        assert.equal(result[3].transactionIndex, 4, 'fourth event transactionIndex 4');
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  