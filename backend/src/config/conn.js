const { type } = require('express/lib/response');

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

        console.log(result[0]);
        return result[0];
        //return callback(null, result[0]);


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

        //callback(err);

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


    function updateNodeDB(apptid, data, content, callback) {
        // Build the SET clause dynamically, ensuring valid fields and data types
        let setClause = "";
        const values = [];
        for (const key in data) {
          if (
            Object.values(data).length > 0 &&
            !key.includes(" ") &&
            ["status", "TimeQueued", "QueueDate", "StartTime", "EndTime", "type", "IsVirtual", "hospitalname", "IsHospital"].includes(key)
          ) {
            // Enclose string values in single quotes for proper escaping and apostrophe handling
            if (typeof data[key] === "string") {
                // console.log("Trial"); trouble shooint
              setClause += `${key} = ?,`;
              values.push(`${data[key]}`); // Add single quotes around strings
            } else if(data[key] instanceof Date) {
                const year = data[key].getFullYear();
                const month = String(data[key].getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
                const day = String(data[key].getDate()).padStart(2, '0'); // Add leading zero for single-digit days
                const hours = String(data[key].getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
                const minutes = String(data[key].getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
              
                const dateString = `${year}-${month}-${day} ${hours}:${minutes}:00`; // Add seconds as 00 (if not required)
                setClause += `${key} = ?,`;
                values.push(dateString);
            } else{
                setClause += `${key} = ?,`;
              values.push(data[key]); // Handle dates
            }
          } else {
            console.warn(`Invalid field or data type: ${key}`);
          }
        }
      
        // Remove trailing comma from SET clause if any
        setClause = setClause.slice(0, -1);
      
        // Build the SQL query using parameterized queries for security
        const sql = `
          UPDATE node0_db
          SET ${setClause}
          WHERE apptid = ?;
        `;
        values.push(apptid); // Add apptid for the WHERE clause
      
        // Execute the query using your database connection library (replace with actual code)

        console.log("LEEEEEEEEEEEEEEEEEEEEEEEEE");
        console.log(setClause);
        console.log(sql);
        
        //dbQuery(node_0, sql, content, callback);
        
        /*
        return connection.query(sql, values, function (error, results, fields) {
          if (error) {
            throw error; // Handle errors appropriately in your application
          }
          console.log('The result is: ', results);
          return results; // Return results only after successful execution
        });*/
      }

    var content, callback;

    searchNodeDB('000019E8D2903D7A8D69B782507287E7', content, callback);


    data = {
        type: 'Consultations'
      }
    updateNodeDB('000019E8D2903D7A8D69B782507287E7', data, content, callback);


    searchNodeDB('000019E8D2903D7A8D69B782507287E7', content, callback);


