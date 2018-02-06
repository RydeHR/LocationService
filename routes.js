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

const addToRedis = new Set([1,2,3,4,5,6,7,8,9,10]);

const cronJobToRedis = () => {
  let arr = [...addToRedis];
  for (let i = 186; i <= 200; i++) {
    sendToRedis(i); //change to cronjob
  }
  addToRedis.clear();
};
// cronJobToRedis();

router.get('/zone', async (ctx) => { // change to post
  let coordinate = ctx.request.body.location;
  let results = await getDrivers(zone(...coordinate));
  ctx.body = {
    message: results
  };
  // addToRedis.add(zone(...coordinate()));
});

router.delete('/driver', async (ctx) => { // get
  let coordinate = ctx.request.body.location;
  // let coord = coordinate();
  let results = await findDriver(coordinate[0], coordinate[1], zone(coordinate[0], coordinate[1]));
  ctx.body = {
    message: {
      id: +results[0][0],
      location: [+results[0][1][0], +results[0][1][1]]
    }
  };
});

router.post('/driver', async (ctx) => { // post
  // let id = Math.floor(Math.random() * 10000000);
  let coordinate = ctx.request.body.location;
  let {id, name} = ctx.request.body;
  // let coord = coordinate();
  // let name = faker.name.firstName().replace("'", "");
  let results = await addDriver(id, name, coordinate[0], coordinate[1], zone(...coordinate)); // lat long id
  ctx.status = 201;
  ctx.body = {
    message: results
  }
});

module.exports = router;
