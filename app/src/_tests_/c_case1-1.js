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
            connection.query("SELECT * FROM node2_db WHERE apptid = '5F04266409AD193A648175E825482967'", (err, results) => {
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


/*
const mysql = require("mysql2");

// Create connection configurations
const connectionConfig = {
  host: 'ccscloud.dlsu.edu.ph',  // e.g., 'localhost'
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20024
};

const connectionConfig2 = {
    host: 'ccscloud.dlsu.edu.ph',  // e.g., 'localhost'
      user: 'root',
      password: 'root',
      database: 'mco2',
      port: 20026
  };


// Create connections with different isolation levels
const connections = {
  READ_UNCOMMITTED: mysql.createConnection({...connectionConfig, transactionIsolation: 'READ UNCOMMITTED'}),
  READ_COMMITTED: mysql.createConnection({...connectionConfig, transactionIsolation: 'READ COMMITTED'}),
  REPEATABLE_READ: mysql.createConnection({...connectionConfig, transactionIsolation: 'REPEATABLE READ'}),
  SERIALIZABLE: mysql.createConnection({...connectionConfig, transactionIsolation: 'SERIALIZABLE'})
};


const connections2 = {
    READ_UNCOMMITTED: mysql.createConnection({...connectionConfig2, transactionIsolation: 'READ UNCOMMITTED'}),
    READ_COMMITTED: mysql.createConnection({...connectionConfig2, transactionIsolation: 'READ COMMITTED'}),
    REPEATABLE_READ: mysql.createConnection({...connectionConfig2, transactionIsolation: 'REPEATABLE READ'}),
    SERIALIZABLE: mysql.createConnection({...connectionConfig2, transactionIsolation: 'SERIALIZABLE'})
  };

// Function to perform the query on each connection
function performQuery(connection) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM node0_db WHERE apptid = '5F04266409AD193A648175E825482967'", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
        // Close the connection after query execution
        connection.end();
      });
    });
  }


  for (let isolationLevel in connections) {
    performQuery(isolationLevel);
}
 
*/
  
/*
// Perform the query on each connection with different isolation levels
for (let isolationLevel in connections) {
    Promise.all([performQuery(isolationLevel), performQuery(isolationLevel)])
    .then(([results1, results2]) => {
      // Compare the results
      const areEqual = JSON.stringify(results1) === JSON.stringify(results2);
      if (areEqual) {
        console.log("Results from both connections are the same.");
      } else {
        console.log("Results from both connections are different.");
      }
    })
    .catch(err => {
      console.error("Error performing query:", err);
    });
}*/