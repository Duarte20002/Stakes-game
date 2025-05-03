const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: "nduqg.h.filess.io",
    user: "Stakes_digtentape",
    password: "4b725ca8eb4dc4d5859fe4b68db3b35a2a896ff5",
    database: "Stakes_digtentape",
    port: 3307
})

module.exports = connection