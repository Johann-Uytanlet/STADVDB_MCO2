const mysql = require("mysql2/promise");

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



// Create MySQL connection pool
/*
const pool = mysql.createPool({
    host: 'ccscloud.dlsu.edu.ph',  
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: '20025',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});*/

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

        return callback(null, result[0]);


    } catch (err) {
        console.log("ERROR IN DBQUERY: ")
        console.log(err);

        // If there is an error, rollback the transaction
        if (connection) await connection.rollback();

        // Call storeQuery with pool, query, and content
        // to store the query in the logs. Ignores read-only queries
        /*
        let query_type = query.split(" ")[0];
        if (process.env.NODE_NUM_CONFIGURATION != -1 && query_type != "SELECT")
            await storeQuery(pool, query, content);*/

        callback(err);

        // Throw the error for handling with try/catch or promises
        throw err;
    } finally {
        // Release the database connection back to the pool
        if (connection) {
            connection.release();
        }
    }
}

function searchNodeDB(apptid, content, callback){
    const sql = `
    SELECT *
    FROM node0_db
    WHERE apptid = '${apptid}';
    `



    dbQuery(node_0, sql, content, callback);
    /*
    const results = connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('The search results for apptid', apptid, 'are:', results);
      });*/
    
      //return results;

    }

    var content, callback;

    searchNodeDB('000019E8D2903D7A8D69B782507287E7', content, callback);
    


