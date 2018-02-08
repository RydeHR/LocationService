require('newrelic');
const Koa = require('koa');
const routes = require('./routes.js');
const app = new Koa();
const port = process.env.PORT || 3000;
const bodyparser = require('koa-bodyparser');
const SQS = require('./SQS.js');

app.use(bodyparser());
app.use(routes.routes());

const server = app.listen(port, () => {
  console.log('listening on port' + port);
});

module.exports = server;
