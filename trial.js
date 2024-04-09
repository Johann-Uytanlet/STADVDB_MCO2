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

async function main() {
    /*
    try {
        // Connect to MySQL
        await connection.connect();

        // Example usage:
        const newData = {
            status: "Completed",
            TimeQueued: new Date(),
            QueueDate: new Date("2024-04-09T10:00:00"),
            StartTime: new Date("2024-04-09T11:00:00"),
            EndTime: new Date("2024-04-09T12:00:00"),
            type: "Consultations",
            IsVirtual: 0,
            MajorIsland: "Some Island",
            hospitalname: "Some Hospital",
            IsHospital: 1
        };

        await insertNodeDB(newData);
        console.log('Insertion successful.');

        // Perform database query
        await searchNodeDB('9876543210FEDCBA');
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Close MySQL connection
        connection.end();
    }*/

    await connection.connect();


    const validData = {
        status: "Completed", // orig is Complete
        TimeQueued: null,
        type: "Consultations", // orig is Consultation
        IsVirtual: 0,
        hospitalname: 'Better Hospital'
      };
    
    
    updateNodeDB('6A0D35175418B71A12B3333597D4FD43', validData)

    connection.end();




}

main();


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
    return connection.query(sql, values, function (error, results, fields) {
      if (error) {
        throw error; // Handle errors appropriately in your application
      }
      console.log('The result is: ', results);
      return results; // Return results only after successful execution
    });
  }
  
  
  function generateRandomHexString(length) {
    const characters = '0123456789ABCDEF';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }
  
  function generateHexStringApptid() {
    return generateRandomHexString(32);
}

async function isApptidUnique(apptid) {
    const sql = `
        SELECT COUNT(*) AS count
        FROM node0_db
        WHERE apptid = ?;
    `;

    return new Promise((resolve, reject) => {
        connection.query(sql, [apptid], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].count === 0);
            }
        });
    });
}
  async function insertNodeDB(data) {
    // Extract data from the input object
    const {
        status,
        TimeQueued,
        QueueDate,
        StartTime,
        EndTime,
        type,
        IsVirtual,
        MajorIsland,
        hospitalname,
        IsHospital
    } = data;

    let apptid;
    let unique = false;

    // Generate a unique apptid
    while (!unique) {
        apptid = generateHexStringApptid();
        unique = await isApptidUnique(apptid);
    }

    // Convert Date objects to the desired format
    const formatDateTime = (datetime) => {
        if (datetime instanceof Date) {
            const year = datetime.getFullYear();
            const month = String(datetime.getMonth() + 1).padStart(2, '0');
            const day = String(datetime.getDate()).padStart(2, '0');
            const hours = String(datetime.getHours()).padStart(2, '0');
            const minutes = String(datetime.getMinutes()).padStart(2, '0');
            const seconds = String(datetime.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else {
            return datetime;
        }
    };

    // Format date and time fields
    const formattedTimeQueued = formatDateTime(TimeQueued);
    const formattedQueueDate = formatDateTime(QueueDate);
    const formattedStartTime = formatDateTime(StartTime);
    const formattedEndTime = formatDateTime(EndTime);

    // Build the SQL query using parameterized queries for security
    const sql = `
      INSERT INTO node0_db 
      (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // Execute the query using your database connection library (replace with actual code)
    const values = [
        apptid,
        status,
        formattedTimeQueued,
        formattedQueueDate,
        formattedStartTime,
        formattedEndTime,
        type,
        IsVirtual,
        MajorIsland,
        hospitalname,
        IsHospital
    ];

    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error); // Handle errors appropriately in your application
            } else {
                console.log('New row inserted successfully.');
                resolve(results); // Return results only after successful execution
            }
        });
    });
}


