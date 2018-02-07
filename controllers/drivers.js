const redis = require("redis");
const Promise = require('bluebird');
const client = redis.createClient();
Promise.promisifyAll(client);
const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });
const faker = require('faker');

client.on("error", function (err) {
  console.log("Error " + err);
});

const adjustCount = (zoneKey, num) => {
  // Redis
  client.hincrbyAsync(zoneKey, 'count', num);

  // Cassandra
  // let queryCount = `SELECT * from zone where zone = ${zoneKey}`;
  // cassClient.execute(queryCount, (err, result) => {
  //   if (err) {
  //     console.error('select err', err);
  //   }
  //   let count = result.rows[0].count + num;
  //   let queryAddCounter = `INSERT into zone(zone, count) values(${zoneKey}, ${count})`;
  //   cassClient.execute(queryAddCounter, (err, result) => {
  //     if (err) {
  //       console.error('insert zone err', err);
  //     }
  //   })
  // });
};

const addDriver = (id, name, long, lat, zoneKey) => {
  // client.geoadd('geo:locations', ...arr);
  // client.hincrbyAsync('zone' + zone(arr[0], arr[1]), 'drivers', 1);
  let query = `INSERT into drivers(id, firstname, long, xlat, zone) values (${id}, '${name}', ${long}, ${lat}, ${zoneKey})`;
  adjustCount(zoneKey, 1);
  return new Promise((resolve, reject) => {
    cassClient.execute(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve('success insert');
      }
    });
  });
};
// addDriver(1,1,1,110).then(results =>{
//   console.log(results);
// });

const findDriver = (long, lat, zoneKey) => {
  return client.georadiusAsync('zone' + zoneKey, long, lat, 5000, 'mi', 'withcoord', 'count', 1, 'asc')
  .then(results => {
    let id = results[0][0];
    // client.zrem('zone' + zoneKey, results[0][0]);
    adjustCount(zoneKey, -1);
    return results;
  })
};
// findDriver(1,1,110);

const deleteDriver = (id, zoneKey) => {
  let query = `INSERT into drivers(id, firstname, long, xlat, zone) values (${id}, null, 0, 0, ${zoneKey}) using ttl 1`;
  cassClient.execute(query, (err, result) => {
    if (err) {
      console.error('delete err', err);
    }
  });
};

module.exports = {
  findDriver,
  addDriver,
  deleteDriver
}
