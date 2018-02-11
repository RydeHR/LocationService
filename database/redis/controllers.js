const redisClient = require('./redis.js');

const adjustCount = (zoneKey, num) => {
  // Redis
  redisClient.hincrbyAsync(zoneKey, 'count', num);

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

const getDrivers = (zoneKey) => {
  return redisClient.hgetAsync(zoneKey, 'count')
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

const findDriver = (long, lat, zoneKey) => {
  return redisClient.georadiusAsync('zone' + zoneKey, long, lat, 5000, 'mi', 'withcoord', 'count', 1, 'asc')
  .then(results => {
    let id = results[0][0];
    // redisClient.zrem('zone' + zoneKey, results[0][0]);
    adjustCount(zoneKey, -1);
    return results;
  })
};
// findDriver(1,1,110);

module.exports = {
  getDrivers,
  adjustCount,
  findDriver
};
