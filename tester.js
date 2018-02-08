const {send, findQ, zoneQ, driverQ} = require('./SQS.js');
const {coordinate} = require('./helpers.js');
// send(zoneQ, JSON.stringify([50,50]));
// send(findQ, JSON.stringify([50,50]));
const sendToQ = () => {
  send(zoneQ, JSON.stringify(coordinate()));
};

setInterval(sendToQ, 100);
