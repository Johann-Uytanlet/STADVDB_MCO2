const mysql = require('mysql2');

// Create MySQL connection
/*
const connection = mysql.createConnection({
    host: 'ccscloud.dlsu.edu.ph',  // e.g., 'localhost'
    user: 'root',
    password: 'root',
    database: 'mco2',
    port: '20024'
}); 
*/


const connection = mysql.createConnection({
    host: 'localhost',  // e.g., 'localhost'
    user: 'root',
    password: '#S4N4four.O',
    database: 'mco2'
}); 


// Connect to MySQL
connection.connect();

// Perform database query
/*
connection.query('SELECT * FROM node0_db LIMIT 100;', function (error, results, fields) {
    if (error) throw error;
    console.log('The result is: ', results);
});*/

// searchNodeDB(2);
console.log(searchNodeDB('000019E8D2903D7A8D69B782507287E7'))

const validData = {
    status: "Completed", // orig is Complete
    TimeQueued: null,
    type: "Consultations", // orig is Consultation
    IsVirtual: 0
  };


//updateNodeDB('000019E8D2903D7A8D69B782507287E7', validData)
  




// Close MySQL connection
connection.end();


function searchNodeDB(apptid){
    const sql = `
    SELECT *
    FROM node0_db
    WHERE apptid = '${apptid}';
    `
    
    const results = connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('The search results for apptid', apptid, 'are:', results);
      });
    
      return results;

}


function searchNodeDBPerPage(pageNumber) {
    // Define limit per page (100 in this case)
    const limit = 100;
  
    // Calculate offset based on page number
    const offset = (pageNumber - 1) * limit;
  
    // Build the SQL query with LIMIT and OFFSET clauses
    const sql = `
      SELECT *
      FROM node0_db
      ORDER BY apptid ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
  
    // Execute the query using your database connection library (specific syntax may vary)
    // Replace `/* your_connection_library.execute(sql) */` with your actual execution code
    const results = connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
    });
  
    return results;
  }



  function updateNodeDB(apptid, data) {
    // Build the SET clause dynamically, ensuring valid fields and data types
    let setClause = "";
    const values = [];
    for (const key in data) {
      if (
        Object.values(data).length > 0 &&
        !key.includes(" ") &&
        ["status", "TimeQueued", "QueueDate", "StartTime", "EndTime", "type", "IsVirtual"].includes(key)
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
    return connection.query(sql, values, function (error, results, fields) {
      if (error) {
        throw error; // Handle errors appropriately in your application
      }
      console.log('The result is: ', results);
      return results; // Return results only after successful execution
    });
  }
  
  
  