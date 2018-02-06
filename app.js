require('newrelic');
const Koa = require('koa');
const routes = require('./routes.js');
const app = new Koa();
const PORT = process.env.PORT || 3000;
const path = require('path');
const bodyparser = require('koa-bodyparser');
const zone = require('./helpers.js');
const {addDriver, findDriver} = require('./controllers/drivers.js');
const {getDrivers} = require('./controllers/zones.js');

app.use(bodyparser());
app.use(routes.routes());

const AWS = require('aws-sdk');
AWS.config.loadFromPath(path.resolve(__dirname, './config.json'));

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Queues
const zoneInfoQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Location";
const driverQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Driver";
const addDriverQ = "https://sqs.us-west-1.amazonaws.com/063772717925/Reactivate";

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
// send(addDriverQ, "{\"id\":3,\"geo\":[50,50]}");

const receive = (url) => {
  let params = {
    AttributeNames: [
      "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    QueueUrl: url,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };
  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else if (data.Messages) {
        resolve(data.Messages);
      }
    })
  });
};

const deleteMessage = (result, queue) => {
  let deleteParams = {
    QueueUrl: queue,
    ReceiptHandle: result[0].ReceiptHandle
  };
  sqs.deleteMessage(deleteParams, function(err, data) {
    if (err) {
      console.log("Delete Error", err);
    } else {
      console.log("Message Deleted", data);
    }
  });
};

// Get ZoneInfo and send to Pricing
const receiveRiderLoc = () => {
  receive(zoneInfoQ).then(result => {
    let start = new Date();
    getDrivers(zone(...JSON.parse(result[0].Body)))
    .then(result => {
      // send(nickurl, JSON.stringify(result)); // send to pricing service queue
      console.log(new Date() - start, 'ms');
    });
    deleteMessage(result, zoneInfoQ);
  }).catch(err => {
    console.error('receive err', err);
  });
};

// Get Driver and send to Client
const sendDriver = () => {
  receive(driverQ).then(result => {
    let start = new Date();
    findDriver(...JSON.parse(result[0].Body), zone(...JSON.parse(result[0].Body)))
    .then(result => {
      // send(markurl, JSON.stringify(result)); // send to client service
      console.log(new Date() - start, 'ms');
    });
    deleteMessage(result, driverQ);
  }).catch(err => {
    console.error('receive err', err);
  });
};
// sendDriver();

// Post Driver and add to DB
//TODO!!
const receiveDriver = () => {
  receive(addDriverQ).then(result => {
    let start = new Date();
    let data = (JSON.parse(result[0].Body));
    addDriver(data.id, data.name, data.geo[0], data.geo[1], zone(data.geo[0], data.geo[1]))
    .then((result) => {
      console.log('add Success', result);
      console.log(new Date() - start, 'ms');
    })
    deleteMessage(result, addDriverQ);
  });
};
// receiveDriver();

const server = app.listen(PORT, () => {
  console.log('listening on port' + PORT);
});

module.exports = server;
