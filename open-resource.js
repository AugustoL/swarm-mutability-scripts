var request = require('request');
const { exec } = require('child_process');

var mru;
for (var i = 0; i < process.argv.length; i++) {
  if (process.argv[i] == '--mru')
    mru = process.argv[i+1];
}

var options = {
  uri: 'https://swarm-gateways.net/bzz-resource:/'+mru,
  method: 'GET'
};


request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const data = new Buffer(body, 'utf8').toString('hex');
    console.log('Opening https://swarm-gateways.net/bzz:/'+data);
    // exec('browse https://swarm-gateways.net/bzz:/'+data);
  } else {
    console.error(error);
  }
});
