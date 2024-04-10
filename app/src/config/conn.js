const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config({path: './conn.env'});

let host, user, password, database, port = [];


const node_0 = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20024,
    connectionLimit: 10
});

const node_1 = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20025,
    connectionLimit: 10
});

const node_2 = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20026,
    connectionLimit: 10
});

node_0.on('connection', (connection) => {
    console.log('Connected to MySQL database: NODE 0');
});

node_0.on('error', (err) => {
    console.log(`Error connecting to database of Node 0: ${err}`);
});

node_1.on('connection', (connection) => {
    console.log('Connected to MySQL database: NODE 1');
});

node_1.on('error', (err) => {
    console.log(`Error connecting to database of Node 1: ${err}`);
});

node_2.on('connection', (connection) => {
    console.log('Connected to MySQL database: NODE 2');
});

node_2.on('error', (err) => {
    console.log(`Error connecting to database of Node 2: ${err}`);
});


// Wrap the pool's getConnection function to return a promise
// for consistency with async/await pattern
async function getConnection(pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            resolve(connection);
        });
    });
}


async function dbQuery(pool, query, content, callback) {
    let connection;
    try {
        // Get a database connection from the pool
        connection = await pool.getConnection();

        // Begin the transaction
        await connection.beginTransaction();

        // Perform the query within the transaction
        const result = await connection.query(query, content);

        // Commit the transaction
        await connection.commit();

        // Release the database connection back to the pool
        connection.release();

        //console.log(result);
        //return result;
        return callback(null, result);


    } catch (err) {
        console.log("ERROR IN DBQUERY: ")
        console.log(err);

        // If there is an error, rollback the transaction
        if (connection) await connection.rollback();

        // Call storeQuery with pool, query, and content
        // to store the query in the logs. Ignores read-only queries
        /*
        let query_type = query.split(" ")[0];
        if (process.env.NODE_NUM_CONFIGURATION != -1 && query_type != "SELECT") {
            await storeQuery(pool, query, content);
        } */

        callback(err);

        // Throw the error for handling with try/catch or promises
        throw err;
    } finally {
        // Release the database connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};

/* 
    TODO: Add/Implement recoverTransactions()

    recoverTransactions() is used to recover transactions that were
    not successfully committed to the database. Works by inserting
    transactions from the logs into the database.
*/
async function recoverTransaction(connection) {
    const [node_0_logs] = await grabLogsOfPool(node_0);
    const [node_1_logs] = await grabLogsOfPool(node_1);
    const [node_2_logs] = await grabLogsOfPool(node_2);

    // Database Recovery
    console.log ("Recovering transactions...")
    // Logs
    console.log("Node 1 Logs: "+node_1_logs);
    console.log("Node 2 Logs: "+node_2_logs);
    console.log("Node 3 Logs: "+node_3_logs);

};

async function grabLogsOfPool(pool) {
    let logs = [];

    let connection = await pool.getConnection();

    const result = await pool.query("SELECT * FROM appointment_logs"); // TODO: Edit/Change to select appointment logs
    
    connection.release();

    for (let i = 0; i < result.length; i++) {
        logs.push(result[i]);
    }

    return logs;
};

function gracefulShutdown (pool) {
    pool.end(function (err) {
        if (err) {
            console.error('Error while closing connection pool: ', err);
        }
        console.log('Shutting down gracefully');
    });
};

//getConnection(node_0);
//getConnection(node_1);
//getConnection(node_2)

module.exports = { node_0, node_1, node_2, dbQuery, getConnection };