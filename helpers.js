const zone = (long, lat) => {
  return Math.ceil(20 * Math.trunc((90 - lat) / 18) + (180 + long) / 18);
};

module.exports = zone;
