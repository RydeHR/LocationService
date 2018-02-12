const server = require('../app.js');
const agent = require('supertest-koa-agent');
const api = agent(server);

const sampleRider = {
  eventId: 123,
  geolocationPickup: [50, 50]
};

const sampleDriver = {
  driverId: 123,
  driverName: 'Arthur',
  geolocationDropoff: [50, 50]
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

// { message: { eventId: 1, driverId: 1, location: [50,50] } }
describe('route: /delete driver', () => {
  it('should respond as expected', async () => {
    const res = await api.delete('/driver').set('Accept', 'application/json').send(sampleRider);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toHaveProperty('eventId');
    expect(res.body.message).toHaveProperty('driverId');
    expect(res.body.message).toHaveProperty('location');
    expect(typeof res.body.message.eventId).toEqual('number');
    expect(typeof res.body.message.driverId).toEqual('number');
    expect(typeof res.body.message.location).toEqual('object');
    // console.log(res.body.message);
  });
});

// { message: 'success insert' }
describe('route: /post driver', () => {
  it('should respond as expected', async () => {
    const res = await api.post('/driver').set('Accept', 'application/json').send(sampleDriver);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('success insert');
  });
});
