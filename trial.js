const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: '10.2.0.24',  // e.g., 'localhost'
    user: 'STADVDB08_Server0',
    password: 'ap4cAKqdRPfFv5xSg7MuW9mQ',
    database: 'mco2'
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
