const redis = require("redis");
const Promise = require('bluebird');
const client = redis.createClient();
Promise.promisifyAll(client);
const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });

client.on("error", function (err) {
  console.log("Error " + err);
});

const getDrivers = (zoneKey) => {
  return client.hgetAsync(zoneKey, 'count')
  .then(result => {
    return {drivers: +result,
           riders: Math.floor(+result * ((Math.random() * (1.4 - 0.7)) + 0.7)),
           zone: zoneKey};
  })
  // const queryC = `SELECT * FROM zone WHERE zone = ${zoneKey}`;
  // const stC = new Date();
  // return cassClient.execute(queryC)
  // .then(result => {
  //   // console.log('time', new Date() - stC);
  //   return {drivers: +result.rows[0].count,
  //           riders: Math.floor(+result.rows[0].count * ((Math.random() * (1.4 - 0.7)) + 0.7)),
  //           zone: zoneKey};
  // });
};
// getDrivers(98);

const sendToRedis = (zoneKey) => {
  const query = `SELECT * FROM drivers WHERE zone = ${zoneKey}`;
  cassClient.execute(query)
  .then(result => {
    result.rows.forEach(driver => {
      client.geoaddAsync('zone' + zoneKey, +driver.long, +driver.xlat, driver.id);
    });
    console.log('complete zone', zoneKey);
  }).catch(err => {
    console.error('err', err);
  });
};

module.exports = {
  getDrivers,
  sendToRedis
};
