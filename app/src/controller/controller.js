const {node_0, node_1, node_2,  dbQuery, getConnection }  = require('../config/conn.js');

// TODO: Replace the if-else statements in the (err, result) anonymous functions to respond with the appropriate status codes and data.
/*
    TODO: Add/Implement the following functions
        - searchNodeDBPerPage
*/

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

const controller = {

    isApptidUnique: async  (req, res) => {
        const apptid  = req.body;

        const sql = `
        SELECT COUNT(*) AS count
        FROM node0_db
        WHERE apptid = \'${apptid}\';
        `;

        //console.log(sql);
        
        await dbQuery(node_0, sql, apptid, (err, result) => {
            if (err) {
                console.log(err);
                //console.log("inside");
            } else {
                //console.log(result);
                //console.log("inside2");
                res.result = result;
                return result;
            }
        });
        //console.log("outside");
    },

    searchAppointment: async  (req, res) => {
        const apptid  = req.body;

        const sql = `
        SELECT *
        FROM node0_db
        WHERE apptid = '${apptid}';
        `;

        //console.log(sql);
        
        await dbQuery(node_0, sql, apptid, (err, result) => {
            if (err) {
                console.log(err);
                console.log("inside");
                res.result = err;
            } else {
                //console.log(result);
                //console.log("inside2");
                res.result = result;
                return result;
            }
        });
        //console.log("outside");
    },

    updateAppointment: async (req, res) => {
        // Build the SET clause dynamically, ensuring valid fields and data types
        data = req.body
        apptid = req.id
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
            setClause += `${key} = \'${data[key]}\',`;
            //setClause += `${key} = ?,`;
            //values.push(`${data[key]}`); // Add single quotes around strings
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
        WHERE apptid = \'${apptid}\';
    `;
        await dbQuery(node_0, sql, apptid, (err, result) => {
        if (err) {
            console.log(err);
            //console.log("inside");
        } else {
            console.log(result);
            //console.log("inside2");
            res.result = result;
            //return result;
        }
});


// find appointment then add to node 1 or 2 accordingly
controller.searchAppointment(apptid)

if(MajorIsland == 'Luzon'){

    const sql = `
    UPDATE node1_db
    SET ${setClause}
    WHERE apptid = \'${apptid}\';
    `;
    
    await dbQuery(node_0, sql, apptid, (err, result) => {
        if (err) {
            console.log(err);
            //console.log("inside");
        } else {
            //console.log(result);
            console.log("Luzon");
        }
    });
} else if (MajorIsland == 'Visayas' || MajorIsland == 'Mindanao') {

    const sql = `
        UPDATE node2_db
        SET ${setClause}
        WHERE apptid = \'${apptid}\';
    `;


    await dbQuery(node_0, sql, apptid, (err, result) => {
        if (err) {
            console.log(err);
            //console.log("inside");
        } else {
            //console.log(result);
            console.log("Visayas/Mindanao");
        }
    });
}
    },

    addAppointment: async (req, res) => {
        const { 
                status, TimeQueued, QueueDate, StartTime, EndTime,
                type, IsVirtual, MajorIsland, hospitalname, IsHospital
            } = req.body;

        let apptid;
        let unique = 1;

        while (unique != 0) {
            apptid = generateHexStringApptid();
            req1 = {body: apptid};
            res1 = {};
            await controller.isApptidUnique(req1, res1);
            unique = res1.result[0][0].count
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
        formattedTimeQueued = formatDateTime(TimeQueued);
        formattedQueueDate = formatDateTime(QueueDate);
        formattedStartTime = formatDateTime(StartTime);
        formattedEndTime = formatDateTime(EndTime);

        const sql = `
            INSERT INTO node0_db 
            (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)
            VALUES (\'${apptid}\', \'${status}\', \'${formattedTimeQueued}\', \'${formattedQueueDate}\', \'${formattedStartTime}\', 
            \'${formattedEndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});
        `;
        
        await dbQuery(node_0, sql, apptid, (err, result) => {
            if (err) {
                console.log(err);
                //console.log("inside");
            } else {
                //console.log(result);
                //console.log("inside2");
                res.result = result;
                res.id = apptid;
                //return result;
            }
        });

        if(MajorIsland == 'Luzon'){

            const sql = `
            INSERT INTO node1_db 
            (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)
            VALUES (\'${apptid}\', \'${status}\', \'${formattedTimeQueued}\', \'${formattedQueueDate}\', \'${formattedStartTime}\', 
            \'${formattedEndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});
            `;
            
            await dbQuery(node_0, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                    //console.log("inside");
                } else {
                    //console.log(result);
                    console.log("Luzon");
                }
            });
        } else if (MajorIsland == 'Visayas' || MajorIsland == 'Mindanao') {

            const sql = `
            INSERT INTO node2_db 
            (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)
            VALUES (\'${apptid}\', \'${status}\', \'${formattedTimeQueued}\', \'${formattedQueueDate}\', \'${formattedStartTime}\', 
            \'${formattedEndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});
            `;


            await dbQuery(node_0, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                    //console.log("inside");
                } else {
                    //console.log(result);
                    console.log("Visayas/Mindanao");
                }
            });
        }


        
    }, 

    deleteNodeDB: async  (req, res) => {
        const apptid  = req.body;

        const sql = `
        DELETE FROM node0_db
        WHERE apptid = '${apptid}';
        `;

        //console.log(sql);
        
        await dbQuery(node_0, sql, apptid, (err, result) => {
            if (err) {
                console.log(err);
                //console.log("inside");
            } else {
                //console.log(result);
                //console.log("inside2");
                res.result = result;
                return result;
            }
        });
        //console.log("outside");
    },

};


req = {body: '000019E8D2903D7A8D69B782507287E7'};
res = {};
//controller.searchAppointment(req, res);
//controller.isApptidUnique(req, res);
module.exports = controller;