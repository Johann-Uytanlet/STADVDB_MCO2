const mysql = require("mysql2");

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',  
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: '20025',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to execute a query
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = executeQuery;
