const Router = require('koa-router');
const router = new Router();
const {findDriver, addDriver} = require('./controllers/drivers.js');
const {getDrivers, sendToRedis} = require('./controllers/zones.js');
const zone = require('./helpers.js');
const faker = require('faker');

const coordinate = () => {
  let long = +faker.address.longitude();
  let lat;
  do {
    lat = +faker.address.latitude();
  } while (Math.abs(lat) > 85);
  return [long, lat];
};

const random = () => {
  return Math.floor(Math.random()*10000000)
}

router.get('/rider', async (ctx) => { // change to post
  let results = await getDrivers(zone(...coordinate())); // 50, 50 from other services
  ctx.body = {
    message: results
  };
  // sendToRedis(zone(...coordinate())); //change to cronjob
});

router.put('/driver', async (ctx) => { // get
  let coord = coordinate();
  let results = await findDriver(coord[0], coord[1], zone(coord[0], coord[1])); // 50, 50 from other services
  // updateZone(zone(50,50), 1, -1);
  ctx.body = {
    message: results
  };
});

router.get('/driver', async (ctx) => { // put
  // updateZone(zone(50,50), -1, 0);
  let coord = coordinate();
  let results = await addDriver(random(), coord[0], coord[1], zone(coord[0], coord[1])); // lat long id
  ctx.body = {
    message:results
  }
});

module.exports = router;
