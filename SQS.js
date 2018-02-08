const {zone} = require('./helpers.js');
const {addDriver, findDriver, deleteDriver} = require('./controllers/drivers.js');
const {getDrivers} = require('./controllers/zones.js');
const AWS = require('aws-sdk');
const path = require('path');
AWS.config.loadFromPath(path.resolve(__dirname, './config.json'));
const Consumer = require('sqs-consumer');

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Queues
const zoneQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Location";
const findQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Driver";
const driverQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Reactivate";

const send = (url, body) => {
  let sendparams = {
    MessageBody: body,
    QueueUrl: url
  };
  sqs.sendMessage(sendparams, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}
// send(zoneQ, JSON.stringify([50,50]));

// const receive = (url) => {
//   let params = {
//     AttributeNames: [
//       "SentTimestamp"
//     ],
//     MaxNumberOfMessages: 1,
//     QueueUrl: url,
//     VisibilityTimeout: 0,
//     WaitTimeSeconds: 0
//   };
//   return new Promise((resolve, reject) => {
//     sqs.receiveMessage(params, (err, data) => {
//       if (err) {
//         reject(err);
//       } else if (data.Messages) {
//         resolve(data.Messages);
//       }
//     })
//   });
// };

// const deleteMessage = (result, queue) => {
//   let deleteParams = {
//     QueueUrl: queue,
//     ReceiptHandle: result[0].ReceiptHandle
//   };
//   sqs.deleteMessage(deleteParams, function(err, data) {
//     if (err) {
//       console.log("Delete Error", err);
//     } else {
//       console.log("Message Deleted", data);
//     }
//   });
// };

// Get ZoneInfo and send to Pricing
const zoneQConsumer = Consumer.create({
  queueUrl: zoneQ,
  region: 'us-west-1',
  handleMessage: (message, done) => {
    let start = new Date();
    getDrivers(zone(...JSON.parse(message.Body)))
    .then(result => {
      console.log(result);
      // send(nickurl, JSON.stringify(result)); // send to pricing service queue
      console.log(new Date() - start, 'ms');
    });
    done();
  }
});

zoneQConsumer.on('error', err => {
  console.error('zoneQ err', err);
});

zoneQConsumer.start();

// Delete Driver and send to Client
const findQConsumer = Consumer.create({
  queueUrl: findQ,
  region: 'us-west-1',
  handleMessage: (message, done) => {
    let start = new Date();
    findDriver(...JSON.parse(message.Body), zone(...JSON.parse(message.Body)))
    .then(result => {
      console.log(result);
      // send(markurl, JSON.stringify(result)); // send to mark service queue
      console.log(new Date() - start, 'ms');
    });
    done();
  }
});

findQConsumer.on('error', err => {
  console.error('findQ err', err);
});

findQConsumer.start();

// Post Driver and add to DB
const driverQConsumer = Consumer.create({
  queueUrl: driverQ,
  region: 'us-west-1',
  handleMessage: (message, done) => {
    let data = JSON.parse(message.Body);
    console.log(data);
    let start = new Date();
    addDriver(data.id, data.name, data.location[0], data.location[1], zone(...data.location))
    .then(result => {
      console.log(result);
      console.log(new Date() - start, 'ms');
    });
    done();
  }
});

driverQConsumer.on('error', err => {
  console.error('driverQ err', err);
});

driverQConsumer.start();

module.exports = {
  zoneQ,
  findQ,
  send,
  driverQ
}
