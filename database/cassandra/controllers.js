const cassClient = require('./cassandra.js');
const {adjustCount} = require('../redis/controllers.js');

const addDriver = (id, name, long, lat, zoneKey) => {
  // redisClient.geoadd('geo:locations', ...arr);
  // redisClient.hincrbyAsync('zone' + zone(arr[0], arr[1]), 'drivers', 1);
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
// addDriver(1,1,1,110);

const deleteDriver = (id, zoneKey) => {
  let query = `INSERT into drivers(id, firstname, long, xlat, zone) values (${id}, null, 0, 0, ${zoneKey}) using ttl 1`;
  cassClient.execute(query, (err, result) => {
    if (err) {
      console.error('delete err', err);
    }
  });
};

module.exports = {
  addDriver,
  deleteDriver
}
