const redis = require("redis");
const Promise = require('bluebird');
const client = redis.createClient();
Promise.promisifyAll(client);

client.on("error", function (err) {
  console.log("Error " + err);
});

const zone = (long, lat) => {
  return Math.ceil(20 * Math.trunc((90 - lat) / 18) + (180 + long) / 18);
};

const getZoneInfo = (zoneKey) => {
  return client.hgetallAsync('zone' + zoneKey)
  .then((res)=> {
    console.log(res);
    return({...res, zone_id: zoneKey});
  });
}

const updateZone = (zoneKey, rider, driver) => {
  client.hincrbyAsync('zone' + zoneKey, 'drivers', driver);
  client.hincrbyAsync('zone' + zoneKey, 'riders', rider);
};

// logRiderAndGetDrivers(0,0);
// buildZones();
module.exports = {
  zone,
  getZoneInfo,
  updateZone
};
