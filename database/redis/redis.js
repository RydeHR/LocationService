const redis = require("redis");
const client = redis.createClient({host: '172.31.10.212'});
// const client = redis.createClient();
const Promise = require('bluebird');
Promise.promisifyAll(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client;
