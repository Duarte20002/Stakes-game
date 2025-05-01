const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SLB1904",
    database: "games"
})

module.exports = connection