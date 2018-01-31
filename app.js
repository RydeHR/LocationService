const Koa = require('koa');
const routes = require('./routes.js');
const app = new Koa();
const PORT = process.env.PORt || 3000;

app.use(routes.routes());

const server = app.listen(PORT, () => {
  console.log('listening on port' + PORT);
});

module.exports = server;
