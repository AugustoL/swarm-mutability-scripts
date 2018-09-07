var request = require('request');

var mru;
for (var i = 0; i < process.argv.length; i++) {
  if (process.argv[i] == '--mru')
    mru = process.argv[i+1];
}

var options = {
  uri: 'https://swarm-gateways.net/bzz-resource:/'+mru+'/meta',
  method: 'GET'
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('META', body)
  } else {
    console.error(error);
  }
});
