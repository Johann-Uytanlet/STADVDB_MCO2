const mysql = require("mysql2");


const node_0 = mysql.createConnection({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20024,
    connectionLimit: 10
});

const node_1 = mysql.createConnection({
    host: 'ccscloud.dlsu.edu.ph',
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: 20025,
    connectionLimit: 10
});

const node_2 = mysql.createConnection({
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

async function main(){

    //connection0 = await node_0.getConnection();
    console.log("sfsfs");

    await node_0.query("SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
    console.log("asdfasdfsda");
    await node_0.beginTransaction;
    x = await node_0.query("SELECT * FROM node2_db WHERE apptid = '5F04266409AD193A648175E825482967");
    
    console.log(x);
    await node_0.commit();
    node_0.release();

    /*
    await dbQuery(node_0, "SELECT * FROM node2_db WHERE apptid = '5F04266409AD193A648175E825482967'", '5F04266409AD193A648175E825482967', (err, result) => {
        if (err) {
            console.log(err);
            //console.log("inside");
        } else {
            //console.log(result);
            //console.log("inside2");
            x = result;
            //return result;
        }
    });*/

    console.log(x);


}


main();