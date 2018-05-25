const Web3 = require('web3');

const Test = artifacts.require("Test");
const web3 = new Web3();
web3.setProvider(Test.web3.currentProvider);

contract('Test', function(accounts) {
  
  it("should result in 4 events whose logIndex represent the position in the transaction (and not as web3/json rpc doc states, the position in the block)", function() {
    let test;
    return Test.deployed().then(function(instance) {
        test = new web3.eth.Contract(Test._json.abi,instance.address);

        return stopAutoMine()
            .then(() => testEvents(test, accounts[0]))
            .then(() => testEvents(test, accounts[0]))
            .then(() => mine())
            .then(() => test.getPastEvents("allEvents"));
    }).then(function(result) {
        assert.equal(result[0].logIndex, 0);
        assert.equal(result[0].transactionIndex, 0);

        assert.equal(result[1].logIndex, 1);
        assert.equal(result[1].transactionIndex, 0);

        assert.equal(result[2].logIndex, 0);
        assert.equal(result[2].transactionIndex, 1);

        assert.equal(result[3].logIndex, 1);
        assert.equal(result[3].transactionIndex, 1);
    });
  });
});

function testEvents(testContract, from) {
    return new Promise((resolve, reject) => {
        var promiEvent = testContract.methods.testEvents().send({from, gas:40000});
        promiEvent.catch((error) => {
            reject(error);
        });

        promiEvent.once('transactionHash', (txHash) => {
            resolve(txHash);
        });
    });
}


function mine() {
    return new Promise((resolve, reject) => {
        console.log('mining...');
        web3.currentProvider.sendAsync({
            method: 'evm_mine',
            params: [],
            jsonrpc: '2.0',
            id: '2'
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


function stopAutoMine() {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            method: 'miner_stop',
            params: [],
            jsonrpc: '2.0',
            id: '3'
        }, (err, result) => {
            if (err) {
                console.log('error while calling miner_stop', err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}