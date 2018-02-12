const faker = require('faker');

const zone = (long, lat) => {
  return Math.ceil(20 * Math.trunc((90 - lat) / 18) + (180 + long) / 18);
};

const coordinate = () => {
  let long = +faker.address.longitude();
  let lat;
  do {
    lat = +faker.address.latitude();
  } while (Math.abs(lat) > 85);
  return [long, lat];
};

module.exports = {
  zone,
  coordinate
};
