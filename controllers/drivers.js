const redis = require("redis");
const Promise = require('bluebird');
const zone = require('../helpers.js');
const client = redis.createClient();
Promise.promisifyAll(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

const addDriver = (arr) => {
  client.geoadd('geo:locations', ...arr);
  client.hincrbyAsync('zone' + zone(arr[0], arr[1]), 'drivers', 1);
};

const findDriver = (long, lat) => {
  return client.georadiusAsync('geo:locations', long, lat, 5000, 'mi', 'withcoord', 'count', 1, 'asc')
  .then(results => {
    client.zrem('geo:locations', results[0][0]);
    return results;
  })
};

module.exports = {
  findDriver,
  addDriver
}
