const redis = require("redis");
const Promise = require('bluebird');
const fs = require('fs');
const es = require('event-stream');
const faker = require('faker');
const client = redis.createClient();
const {addDriver} = require('./drivers.js');

const buildZones = () => {
  for (let i = 0; i < 200; i++) {
    client.hmset('zone' + (i + 1), "drivers", 0, "riders", 0);
  }
};
buildZones();

const createDrivers = (path, n, index = 0) => {
  let wstream = fs.createWriteStream(path);
  for (let i  = 0; i < n; i++) {
    let long = +faker.address.longitude();
    let lat;
    do {
      lat = +faker.address.latitude();
    } while (Math.abs(lat) > 85);
    if (i === n - 1) {
      wstream.write([long, lat, i + 1 + index].join(','));
      wstream.end();
      return;
    } else {
      wstream.write([long, lat, i + 1 + index].join(',') + '\n');
    }
  }
};

const insertDataIntoDB = (path) => {
  let start = new Date();
  let stream = fs.createReadStream(path)
  .pipe(es.split())
  .pipe(es.mapSync((line) => {
    stream.pause();
    addDriver(line.split(','));
    stream.resume();
  })
  .on('error', (err) => {
    console.log('Error while reading file.', err);
  })
  .on('end', () => {
    console.log('Read entire file.')
    console.log((new Date() - start) / 1000, 'seconds');
    client.quit();
  })
  );
}
createDrivers('test.txt', 10);
console.log('half');
insertDataIntoDB('test.txt');
// createDrivers('ten2.txt', 5000000, 5000000);
// console.log('done');
