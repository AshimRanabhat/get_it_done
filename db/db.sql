create table user_data(
    email text unique not null,
    name text not null,
    password text not null,
    successful_days text[]                         
);

