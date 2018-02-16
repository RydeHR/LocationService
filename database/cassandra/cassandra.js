const cassandra = require('cassandra-driver');
const cassClient = new cassandra.Client({ contactPoints: ['172.31.12.116'], keyspace: 'location' });
// const cassClient = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'location' });

module.exports = cassClient;
