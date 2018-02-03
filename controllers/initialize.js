// const redis = require('redis');
const Promise = require('bluebird');
const fs = require('fs');
const es = require('event-stream');
const faker = require('faker');
// const client = redis.createClient();
// const {addDriver} = require('./drivers.js');
const zone = require('../helpers.js');
const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });

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

const buildZones = () => {
  for (let i = 1; i < 200; i++) {
    let query = `SELECT count(*) FROM drivers WHERE zone = ${i}`;
    cassClient.execute(query)
    .then(result => {
      let count = +result.rows[0].count;
      console.log(count);
      let queryN = `INSERT into zone(zone, count) values(${i}, ${count})`;
      cassClient.execute(queryN);
    }).catch(err => {
      console.error('err', err);
    });
  }
};
// buildZones();

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
//     // client.quit();
//   })
//   );
// }

// createDrivers('tenMillon/test.txt', 7);
// createDrivers('tenMillon/9.txt', 1000000, 9000000);
// console.log('done');
// insertDataIntoDB('test.txt');
// createDrivers('ten2.txt', 5000000, 5000000);
// console.log('done');
