var request = require('request');

var owner, name;
for (var i = 0; i < process.argv.length; i++) {
  if (process.argv[i] == '--owner')
    owner = process.argv[i+1];
  if (process.argv[i] == '--name')
    name = process.argv[i+1];
}

var options = {
  uri: 'https://swarm-gateways.net/bzz-resource:/',
  method: 'POST',
  json: {
    "name":name,
    "frequency":120,
    "startTime":parseInt(new Date().getTime()/1000)-30,
    "ownerAddr":owner
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('MRU_MANIFEST_KEY', body)
  } else {
    console.error(response);
  }
});
