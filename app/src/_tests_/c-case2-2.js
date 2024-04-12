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
    port: 20026
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

// Create connections
var connection0 = createConnection(connectionConfig0, "READ UNCOMMITTED");
var connection2 = createConnection(connectionConfig2, "READ UNCOMMITTED");

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
var updateQuery = `UPDATE node2_db SET status = 'Queue' WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D'`;
var readQuery = `SELECT * FROM node2_db WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D' FOR UPDATE`;
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

/*


    // Create connections
connection0 = createConnection(connectionConfig0, "READ COMMITTED");
connection2 = createConnection(connectionConfig2, "READ COMMITTED");

// Perform update operation on connection0 and read operation on connection2 concurrently
var updateQuery = `UPDATE node2_db SET status = 'Complete' WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D'`;
var readQuery = `SELECT * FROM node2_db WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D' FOR UPDATE`;
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


    // Create connections
connection0 = createConnection(connectionConfig0, "REPEATABLE READ");
connection2 = createConnection(connectionConfig2, "REPEATABLE READ");

var updateQuery = `UPDATE node2_db SET status = 'Complete' WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D'`;
var readQuery = `SELECT * FROM node2_db WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D' FOR UPDATE`;
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


connection0 = createConnection(connectionConfig0, "REPEATABLE READ");
connection2 = createConnection(connectionConfig2, "REPEATABLE READ");

var updateQuery = `UPDATE node2_db SET status = 'Complete' WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D'`;
var readQuery = `SELECT * FROM node2_db WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D' FOR UPDATE`;
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

connection0 = createConnection(connectionConfig0, "SERIALIZBLE");
connection2 = createConnection(connectionConfig2, "SERIALIZBLE");

var updateQuery = `UPDATE node2_db SET status = 'Complete' WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D'`;
var readQuery = `SELECT * FROM node2_db WHERE apptid = '0003B984F5A0CADDF731D8E2E26EAC3D' FOR UPDATE`;
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


    */