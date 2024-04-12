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

// Function to create a connection with the given isolation level
function createConnection(connectionConfig, isolationLevel) {
    const connection = mysql.createConnection(connectionConfig);
    // Set isolation level
    connection.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
    return connection;
}

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

/*
// UNCOMMITED

var connection0 = createConnection(connectionConfig0, "READ UNCOMMITTED");
var connection2 = createConnection(connectionConfig2,  "READ UNCOMMITTED");

var updateQuery = `UPDATE node1_db SET status = 'Queue' WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;
var readQuery = `SELECT * FROM node1_db WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;


Promise.all([  
    performQuery(connection0, updateQuery),           
    performQuery(connection2, readQuery)
])
    .then(([updateResults, readResults]) => {
        console.log(`Isolation level: READ UNCOMMITTED`);
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
*/

    // COMMITTEd

    var connection0 = createConnection(connectionConfig0, "READ COMMITTED");
    var connection2 = createConnection(connectionConfig2, "READ COMMITTED");
    
    var updateQuery = `UPDATE node1_db SET status = 'Complete' WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;
    var readQuery = `SELECT * FROM node1_db WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5' FOR UPDATE`;
    
    
    Promise.all([  
        performQuery(connection0, updateQuery),           
        performQuery(connection2, readQuery)
    ])
        .then(([updateResults, readResults]) => {
            console.log(`Isolation level: READ COMMITTED`);
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


/*
var connection0 = createConnection(connectionConfig0, "REPEATABLE READ");
var connection2 = createConnection(connectionConfig2, "REPEATABLE READ");

var updateQuery = `UPDATE node1_db SET status = 'Queue' WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;
var readQuery = `SELECT * FROM node1_db WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5' FOR UPDATE`;


Promise.all([  
    performQuery(connection0, updateQuery),           
    performQuery(connection2, readQuery)
])
    .then(([updateResults, readResults]) => {
        console.log(`Isolation level: REPEATABLE READ`);
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



var connection0 = createConnection(connectionConfig0, "SERIALIZABLE");
var connection2 = createConnection(connectionConfig2,  "SERIALIZABLE");

var updateQuery = `UPDATE node1_db SET status = 'Complete' WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5'`;
var readQuery = `SELECT * FROM node1_db WHERE apptid = '0003F18CD0265CC90DD2D530B4D511F5' FOR UPDATE`;


Promise.all([  
    performQuery(connection0, updateQuery),           
    performQuery(connection2, readQuery)
])
    .then(([updateResults, readResults]) => {
        console.log(`Isolation level: SERIALIZABLE`);
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


    */