const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'ccscloud.dlsu.edu.ph',  // e.g., 'localhost'
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: '20024'
});

// Connect to MySQL
connection.connect();

// Perform database query
connection.query('SELECT * FROM node1_db LIMIT 100;', function (error, results, fields) {
    if (error) throw error;
    console.log('The result is: ', results);
});

// Close MySQL connection
connection.end();
