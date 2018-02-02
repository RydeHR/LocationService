create keyspace jackie with replication = {'class':'SimpleStrategy','replication_factor' : 1};

use jackie;

create table drivers (
  id int,
  firstname text,
  long float,
  xlat float,
  zone int,
  primary key(zone, id)
);
