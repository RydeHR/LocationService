const chai = require('chai');
const assert = require('assert');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app.js');
const faker = require('faker');

chai.use(chaiHttp);

describe ('/GET zone', () => {
  let rider = {
    location: [50,50]
  }

  it ('should return an object containing the zone information', (done) => {
  	chai.request(server).get('/zone').send(rider).end((err,  res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.message.should.have.property('drivers');
      res.body.message.should.have.property('riders');
      res.body.message.should.have.property('zone');
      res.body.message.drivers.should.be.a('number');
      res.body.message.riders.should.be.a('number');
      res.body.message.zone.should.be.a('number');
      done();
    });
  });

  it ('should send back the correct zone', (done) => {
  	chai.request(server).get('/zone').send(rider).end((err,  res) => {
  	  res.should.have.status(200);
      res.body.message.zone.should.be.eql(53);
      done();
    });
  });
});

describe ('/POST driver', () => {
  let driver = {
    id: 123,
    name: faker.name.firstName().replace("'", ""),
    location: [50,50]
  }

  it ('should add a driver', (done) => {
  	chai.request(server).post('/driver').send(driver).end((err,  res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.message.should.be.eql('success insert');
      done();
    });
  });

});

describe ('/DELETE driver', () => {
  let rider = {
    location: [50,50]
  }

  it ('should find and delete a driver', (done) => {
  	chai.request(server).delete('/driver').send(rider).end((err,  res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.message.should.have.property('id');
      res.body.message.should.have.property('location');
      res.body.message.id.should.be.a('number');
      res.body.message.location.should.be.a('array');
      done();
    });
  });

});
