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
function performQuery(connection, isolationLevel) {
    return new Promise((resolve, reject) => {
        // Set transaction isolation level
        connection.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`, (err) => {
            if (err) {
                reject(err);
                return;
            }

            // Perform the SELECT query
            connection.query("SELECT * FROM node1_db WHERE apptid = '0001A54F8BC6B8A98F79856AA58C75EA' FOR UPDATE", (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });
}

// Perform the queries with different isolation levels
Promise.all([
    performQuery(connection0, 'READ UNCOMMITTED'),
    performQuery(connection2, 'READ UNCOMMITTED')
]).then(([results1, results2]) => {
    // Compare the results
    const areEqual = JSON.stringify(results1) === JSON.stringify(results2);
    if (areEqual) {
        console.log("READ UNCOMMITTED - Results from both connections are the same.");
    } else {
        console.log("READ UNCOMMITTED - Results from both connections are different.");
    }
}).catch(err => {
    console.error("Error performing query:", err);
});

Promise.all([
    performQuery(connection0, 'READ COMMITTED'),
    performQuery(connection2, 'READ COMMITTED')
]).then(([results1, results2]) => {
    // Compare the results
    const areEqual = JSON.stringify(results1) === JSON.stringify(results2);
    if (areEqual) {
        console.log("READ COMMITTED - Results from both connections are the same.");
    } else {
        console.log("READ COMMITTED - Results from both connections are different.");
    }
}).catch(err => {
    console.error("Error performing query:", err);
});

Promise.all([
    performQuery(connection0, 'REPEATABLE READ'),
    performQuery(connection2, 'REPEATABLE READ')
]).then(([results1, results2]) => {
    // Compare the results
    const areEqual = JSON.stringify(results1) === JSON.stringify(results2);
    if (areEqual) {
        console.log("REPEATABLE READ - Results from both connections are the same.");
    } else {
        console.log("REPEATABLE READ - Results from both connections are different.");
    }
}).catch(err => {
    console.error("Error performing query:", err);
});

Promise.all([
    performQuery(connection0, 'SERIALIZABLE'),
    performQuery(connection2, 'SERIALIZABLE')
]).then(([results1, results2]) => {
    // Compare the results
    const areEqual = JSON.stringify(results1) === JSON.stringify(results2);
    if (areEqual) {
        console.log("SERIALIZABLE - Results from both connections are the same.");
    } else {
        console.log("SERIALIZABLE - Results from both connections are different.");
    }
}).catch(err => {
    console.error("Error performing query:", err);
}).finally(() => {
    // Close the connections after all queries are executed
    connection0.end();
    connection2.end();
});

