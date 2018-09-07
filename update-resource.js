const Web3 = require('web3');
const web3 = new Web3();
const { mruUpdateDigest } = require('./mru-digest.js');

var request = require('request');

var mru, privateKey, newData, isMultihash=false;
for (var i = 0; i < process.argv.length; i++) {
  if (process.argv[i] == '--mru')
    mru = process.argv[i+1];
  if (process.argv[i] == '--privateKey')
    privateKey = process.argv[i+1];
  if (process.argv[i] == '--data')
    newData = process.argv[i+1];
  if (process.argv[i] == '--multihash')
    isMultihash = true;
}

console.log('Updating mru', mru, 'with', newData);

var options = {
  uri: 'https://swarm-gateways.net/bzz-resource:/'+mru+'/meta',
  method: 'GET'
};

isMultihash=false;

request(options, async function (error, response, body) {
  if (!error && response.statusCode == 200) {

    const metaBody = JSON.parse(body);
    console.log('META', metaBody)

    console.log('Digest mru update for', {
    	"period": metaBody.period,
    	"version": metaBody.version,
    	"multihash": metaBody.multiHash,
    	"data": newData,
    	"metaHash": metaBody.metaHash,
    	"rootAddr": metaBody.rootAddr
    });

    const dataToSign = mruUpdateDigest({
    	"period": metaBody.period,
    	"version": metaBody.version,
    	"multihash": metaBody.multiHash,
    	"data": newData,
    	"metaHash": metaBody.metaHash,
    	"rootAddr": metaBody.rootAddr
    });

    web3.eth.accounts.wallet.add(privateKey);
    const account = web3.eth.accounts.wallet[0].address;
    console.log('Data to sign', dataToSign, 'by account', account);
    const signature = await web3.eth.sign(dataToSign, account);

    console.log('Signer recovered before sending',web3.eth.accounts.recover(dataToSign, signature));
    web3.eth.accounts.wallet.clear();

    console.log('Signature', signature);

    metaBody.data = newData;
    metaBody.signature = signature;

    request({
      uri: 'https://swarm-gateways.net/bzz-resource:/',
      method: 'POST',
      json: metaBody
    }, function (error2, response2, body2) {
      console.log('Result', body2);
    });
  } else {
    console.error(error);
  }
});
