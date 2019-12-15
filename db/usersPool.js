const mysql2 = require("mysql2")
const { DB_HOST, DB_USER, DB_PORT, DB_USER_PASS, DATABASE } = process.env

const userPool = mysql2.createPool(
    {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_USER_PASS,
        database: "users",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0

    }
)

module.exports = userPool.promise() 