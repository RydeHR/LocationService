const redis = require("redis");
const Promise = require('bluebird');
const zone = require('../helpers.js');
const client = redis.createClient();
Promise.promisifyAll(client);
const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });
const faker = require('faker');

client.on("error", function (err) {
  console.log("Error " + err);
});

const adjustCount = (zoneKey, num) => {
  let queryCount = `SELECT * from zone where zone = ${zoneKey}`;
  cassClient.execute(queryCount, (err, result) => {
    if (err) {
      console.error('select err', err);
    }
    let count = result.rows[0].count + num;
    let queryAddCounter = `INSERT into zone(zone, count) values(${zoneKey}, ${count})`;
    cassClient.execute(queryAddCounter, (err, result) => {
      if (err) {
        console.error('insert zone err', err);
      }
      console.log('zone adjusted success');
    })
  });
};

const addDriver = (id, long, lat, zoneKey) => {
  // client.geoadd('geo:locations', ...arr);
  // client.hincrbyAsync('zone' + zone(arr[0], arr[1]), 'drivers', 1);
  let name = faker.name.firstName();
  let query = `INSERT into drivers(id, firstname, long, xlat, zone) values (${id}, '${name}', ${long}, ${lat}, ${zoneKey})`;
  adjustCount(zoneKey, 1);
  return new Promise((resolve, reject) => {
    cassClient.execute(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
// addDriver(1,1,1,110);

const findDriver = (long, lat, zoneKey) => {
  return client.georadiusAsync('zone' + zoneKey, long, lat, 5000, 'mi', 'withcoord', 'count', 1, 'asc')
  .then(results => {
    // client.zrem('zone' + zoneKey, results[0][0]);
    adjustCount(zoneKey, -1);
    return results;
  })
};
// findDriver(1,1,110);

module.exports = {
  findDriver,
  addDriver
}
