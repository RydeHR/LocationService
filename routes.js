const Router = require('koa-router');
const router = new Router();
const {findDriver, addDriver} = require('./controllers/drivers.js');
const {getZoneInfo, updateZone, getDrivers} = require('./controllers/zones.js');
const zone = require('./helpers.js');

router.get('/rider', async (ctx) => { // change to post
  let results = await getZoneInfo(zone(50,50)); // 50, 50 from other services
  ctx.body = {
    message: results
  };
});

router.put('/driver', async (ctx) => { // get
  let results = await findDriver(50, 50); // 50, 50 from other services
  updateZone(zone(50,50), 1, -1);
  ctx.body = {
    message: results
  };
});

router.get('/driver', async (ctx) => { // put
  updateZone(zone(50,50), -1, 0);
  addDriver([50, 50, 1]); // lat long id
});

module.exports = router;
