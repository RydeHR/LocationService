const server = require('../app.js');
// const request = require("supertest");
const agent = require('supertest-koa-agent');
const api = agent(server);

const sampleRider = {
  eventId: 123,
  geolocationPickup: [50, 50]
};

// { message: { drivers: 0, riders: 0, zone: 185 } }
describe('route: /get zone', () => {
  it('should respond as expected', async () => {
    const res = await api.get('/zone').set('Accept', 'application/json').send(sampleRider);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toHaveProperty('drivers');
    expect(res.body.message).toHaveProperty('riders');
    expect(res.body.message).toHaveProperty('zone');
    expect(typeof res.body.message.drivers).toEqual('number');
    expect(typeof res.body.message.riders).toEqual('number');
    expect(typeof res.body.message.zone).toEqual('number');
    // console.log(res.body.message);
  });
  it('should respond with the correct zone', async () => {
    const res = await api.get('/zone').set('Accept', 'application/json').send(sampleRider);
    expect(res.body.message.zone).toEqual(53);
  });
});

// { message: { drivers: 0, riders: 0, zone: 185 } }
describe('route: /delete driver', () => {
  it('should respond as expected', async () => {
    const res = await api.delete('/driver').set('Accept', 'application/json').send(sampleRider);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toHaveProperty('id');
    expect(res.body.message).toHaveProperty('location');
    expect(typeof res.body.message.drivers).toEqual('number');
    expect(typeof res.body.message.riders).toEqual('number');
    expect(typeof res.body.message.zone).toEqual('number');
    // console.log(res.body.message);
  });
});

// describe ('/POST driver', () => {
//   let driver = {
//     id: 123,
//     name: faker.name.firstName().replace("'", ""),
//     location: [50,50]
//   }
//
//   it ('should add a driver', (done) => {
//   	chai.request(server).post('/driver').send(driver).end((err,  res) => {
//       res.should.have.status(201);
//       res.body.should.be.a('object');
//       res.body.message.should.be.eql('success insert');
//       done();
//     });
//   });
//
// });
//
// describe ('/DELETE driver', () => {
//   let rider = {
//     location: [50,50]
//   }
//
//   it ('should find and delete a driver', (done) => {
//   	chai.request(server).delete('/driver').send(rider).end((err,  res) => {
//       res.should.have.status(200);
//       res.body.should.be.a('object');
//       res.body.message.should.have.property('id');
//       res.body.message.should.have.property('location');
//       res.body.message.id.should.be.a('number');
//       res.body.message.location.should.be.a('array');
//       done();
//     });
//   });
//
// });
