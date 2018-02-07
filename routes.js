const Router = require('koa-router');
const router = new Router();
const {findDriver, addDriver, deleteDriver} = require('./controllers/drivers.js');
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
  for (let i = 101; i <= 200; i++) {
    sendToRedis(i); //change to cronjob
  }
  // addToRedis.clear();
};
// cronJobToRedis();

router.get('/zone', async (ctx) => { // change to post
  let coords = ctx.request.body.location || coordinate();
  let results = await getDrivers(zone(...coords));
  ctx.body = {
    message: results
  };
  // addToRedis.add(zone(...coordinate()));
});

router.delete('/driver', async (ctx) => { // get
  let coords = ctx.request.body.location || coordinate();
  // let coord = coordinate();
  let results = await findDriver(coords[0], coords[1], zone(...coords));
  ctx.body = {
    message: {
      id: +results[0][0],
      location: [+results[0][1][0], +results[0][1][1]],
      zone: zone(...coords)
    }
  };
  deleteDriver(+results[0][0], zone(...coords));
});

router.post('/driver', async (ctx) => { // post
  let coords = ctx.request.body.location || coordinate();
  let id = ctx.request.body.id || Math.floor(Math.random() * 10000000);
  let name = ctx.request.body.name || faker.name.firstName().replace("'", "");
  let results = await addDriver(id, name, coords[0], coords[1], zone(...coords)); // lat long id
  ctx.status = 201;
  ctx.body = {
    message: results
  }
});

module.exports = router;
