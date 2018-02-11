const redis = require("redis");
const client = redis.createClient({host: 'redis'});
// const client = redis.createClient();
const Promise = require('bluebird');
Promise.promisifyAll(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client;
