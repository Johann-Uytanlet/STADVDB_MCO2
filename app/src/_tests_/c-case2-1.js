const mysql = require("mysql2");

// Create connection configurations
const connectionConfig0 = {
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20024
};

const connectionConfig2 = {
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20025
};

// Create connections
const connection0 = mysql.createConnection(connectionConfig0);
const connection2 = mysql.createConnection(connectionConfig2);

// Function to perform the query on a connection and return a promise with the results
function performQuery(connection, sqlQuery) {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Perform update operation on connection0 and read operation on connection2 concurrently
const updateQuery = `UPDATE node1_db SET status = 'Queue' WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;
const readQuery = `SELECT * FROM node1_db WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5' FOR UPDATE`;
Promise.all([  
    performQuery(connection0, updateQuery),           
    performQuery(connection2, readQuery)
])
    .then(([updateResults, readResults]) => {
        console.log("Update results:", updateResults);
        console.log("Read results:", readResults);
        console.log("Read results should not have updated changes");
    })
    .catch(err => {
        console.error("Error performing query:", err);
    })
    .finally(() => {
        // Close the connections after all queries are executed
        connection0.end();
        connection2.end();
    });
