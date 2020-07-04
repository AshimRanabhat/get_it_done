const pg = require('pg');

let pool = new pg.Pool({
    user: 'apps',
    database: 'get_it_done',
    password: process.env.dbPassword,
    port: 5432,
    host: 'localhost'
})

module.exports = pool;