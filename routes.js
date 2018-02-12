const Router = require('koa-router');
const router = new Router();
const {addDriver, deleteDriver} = require('./database/cassandra/controllers.js');
const {getDrivers, findDriver} = require('./database/redis/controllers.js');
const {zone, coordinate} = require('./helpers.js');
const {cronJobToRedis} = require('./initialize.js');
const faker = require('faker');
const CronJob = require('cron').CronJob;

new CronJob('*/5 * * * *', () => {
  cronJobToRedis();
}, null, true, 'America/Los_Angeles');

router.get('/zone', async (ctx) => { // change to post
  // console.log(ctx.request.body);
  let coords = ctx.request.body.geolocationPickup || coordinate();
  let results = await getDrivers(zone(...coords));
  ctx.body = {
    message: results
  };
});

router.delete('/driver', async (ctx) => { // get
  let coords = ctx.request.body.geolocationPickup || coordinate();
  // let coord = coordinate();
  let results = await findDriver(coords[0], coords[1], zone(...coords));
  ctx.body = {
    message: {
      eventId: ctx.request.body.eventId || 1,
      driverId: +results[0][0],
      location: [+results[0][1][0], +results[0][1][1]],
      zone: zone(...coords)
    }
  };
  deleteDriver(+results[0][0], zone(...coords));
});

router.post('/driver', async (ctx) => { // post
  let coords = ctx.request.body.geolocationDropoff || coordinate();
  let id = ctx.request.body.driverId || Math.floor(Math.random() * 10000000);
  let name = ctx.request.body.driverName || faker.name.firstName().replace("'", "");
  let results = await addDriver(id, name, coords[0], coords[1], zone(...coords)); // lat long id
  ctx.status = 201;
  ctx.body = {
    message: results
  }
});

module.exports = router;
