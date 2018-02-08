const redis = require("redis");
const client = redis.createClient();
const Promise = require('bluebird');
Promise.promisifyAll(client);
const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });
const faker = require('faker');

client.on("error", function (err) {
  console.log("Error " + err);
});

const zone = (long, lat) => {
  return Math.ceil(20 * Math.trunc((90 - lat) / 18) + (180 + long) / 18);
};

const coordinate = () => {
  let long = +faker.address.longitude();
  let lat;
  do {
    lat = +faker.address.latitude();
  } while (Math.abs(lat) > 85);
  return [long, lat];
};

const sendToRedis = (start, end) => {
  for (let i = start; i <= end; i++) {
    const query = `SELECT * FROM drivers WHERE zone = ${i}`;
    cassClient.execute(query)
    .then(result => {
      result.rows.forEach(driver => {
        client.geoaddAsync('zone' + i, +driver.long, +driver.xlat, driver.id);
      });
      console.log('complete zone', i);
    }).catch(err => {
      console.error('err', err);
    });
  }
};

const cronJobToRedis = () => {
  sendToRedis(1, 25);
  setTimeout(() => sendToRedis(26, 50), 10000);
  setTimeout(() => sendToRedis(51, 75), 20000);
  setTimeout(() => sendToRedis(76, 100), 30000);
  setTimeout(() => sendToRedis(101, 125), 40000);
  setTimeout(() => sendToRedis(126, 150), 50000);
  setTimeout(() => sendToRedis(151, 175), 60000);
  setTimeout(() => sendToRedis(176, 200), 70000);
};

module.exports = {
  zone,
  coordinate,
  cronJobToRedis
};
