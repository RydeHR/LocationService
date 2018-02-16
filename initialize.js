const fs = require('fs');
const es = require('event-stream');
const faker = require('faker');
const redisClient = require('./database/redis/redis.js');
const cassClient = require('./database/cassandra/cassandra.js');
const {zone} = require('./helpers.js');

const sendToRedis = (start, end) => {
  for (let i = start; i <= end; i++) {
    const query = `SELECT * FROM drivers WHERE zone = ${i}`;
    cassClient.execute(query)
    .then(result => {
      result.rows.forEach(driver => {
        redisClient.geoaddAsync('zone' + i, +driver.long, +driver.xlat, driver.id);
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

// read from cassandra and write to redis
const buildZones = (start, end) => {
  for (let i = start; i <= end; i++) {
    let query = `SELECT count(*) FROM drivers WHERE zone = ${i}`;
    cassClient.execute(query)
    .then(result => {
      let count = +result.rows[0].count;
      console.log(count);
      redisClient.hsetAsync(i, 'count', count);
    }).catch(err => {
      console.error('err', err);
    });
  }
};

const createZone = () => {
  buildZones(1, 25);
  setTimeout(() => buildZones(26, 50), 10000);
  setTimeout(() => buildZones(51, 75), 20000);
  setTimeout(() => buildZones(76, 100), 30000);
  setTimeout(() => buildZones(101, 125), 40000);
  setTimeout(() => buildZones(126, 150), 50000);
  setTimeout(() => buildZones(151, 175), 60000);
  setTimeout(() => buildZones(176, 200), 70000);
};

setTimeout(createZone, 180000);

const createDrivers = (path, n, index = 0) => {
  let wstream = fs.createWriteStream(path);
  for (let i  = 0; i < n; i++) {
    let long = +faker.address.longitude();
    let lat;
    do {
      lat = +faker.address.latitude();
    } while (Math.abs(lat) > 85);
    let data = [i + 1 + index, faker.name.firstName(), long, lat, zone(long, lat)].join(',');
    if (i === n - 1) {
      wstream.write(data);
      wstream.end();
    } else {
      wstream.write(data + '\n');
    }
  }
};

// const insertDataIntoDB = (path) => {
//   let start = new Date();
//   let stream = fs.createReadStream(path)
//   .pipe(es.split())
//   .pipe(es.mapSync((line) => {
//     stream.pause();
//     // addDriver(line.split(','));
//     stream.resume();
//   })
//   .on('error', (err) => {
//     console.log('Error while reading file.', err);
//   })
//   .on('end', () => {
//     console.log('Read entire file.')
//     console.log((new Date() - start) / 1000, 'seconds');
//     // redisClient.quit();
//   })
//   );
// }

// createDrivers('tenMillion/test.txt', 500000);
// createDrivers('tenMillion/9.txt', 1000000, 9000000);
// console.log('done');
// insertDataIntoDB('test.txt');
// createDrivers('ten2.txt', 5000000, 5000000);
// console.log('done');

module.exports = {
  cronJobToRedis
}
