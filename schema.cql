drop keyspace if exists location;
create keyspace location with replication = {'class':'SimpleStrategy','replication_factor' : 2};

use location;

create table drivers (
  id int,
  firstname text,
  long float,
  xlat float,
  zone int,
  primary key(zone, id)
);

create table zone (
  zone int,
  count int,
  primary key (zone)
);

copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/0.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/1.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/2.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/3.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/4.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/5.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/6.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/7.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/8.txt' with delimiter=',';
copy drivers (id,firstname,long,xlat,zone) from 'tenMillion/9.txt' with delimiter=',';
