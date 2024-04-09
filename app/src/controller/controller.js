const conn = require('../config/conn.js');

function isApptidUnique(apptid) {
    const query = `
        SELECT COUNT(*) AS count
        FROM node0_db
        WHERE apptid = ?;
    `;

    return dbQuery(node_0, query, apptid, callback);
};

// TODO: Replace the if-else statements in the (err, result) anonymous functions to respond with the appropriate status codes and data.
const controller = {

    searchAppointment: (req, res) => {
        const { apptid } = req.body;

        const query = `
            SELECT *
            FROM node0_db
            WHERE ?;
        `;

        conn.dbQuery(node_0, query, apptid, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    },

    updateAppointment: (req, res) => {
        /*
            Required input from user:
                - apptid
                - data object containing edits/updates (key: value)
        */
        const { apptid, data } = req.body; 

        let setClause = "";

        const values = [];

        let key;

        for (key in data) {
            if (
                Object.values(data).length > 0 &&
                !key.includes(" ") &&
                ["status", "TimeQueued", "QueueDate", "StartTime", "EndTime", "type", "IsVirtual", "hospitalname", "IsHospital"].includes(key)
            ) {
                if (typeof data[key] === "string") {
                    setClause += `${key} = \'${data[key]}\',`;
                } else if(data[key] instanceof Date) {
                    const year = data[key].getFullYear();
                    const month = String(data[key].getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
                    const day = String(data[key].getDate()).padStart(2, '0'); // Add leading zero for single-digit days
                    const hours = String(data[key].getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
                    const minutes = String(data[key].getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
                    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:00`; // Add seconds as 00 (if not required)
                    setClause += `${key} = ?,`;
                    values.push(dateString);
                } else {
                    setClause += `${key} = ?,`;
                    values.push(data[key]); // Handle dates
                }
            } else {
                console.warn(`Invalid field or data type: ${key}`);
            }
        }

        // Remove trailing comma from SET clause if any
        setClause = setClause.slice(0, -1);

        const query = `
            UPDATE node0_db
            SET ?
            WHERE apptid = ?;
        `;

        const content = {
            setClause,
            apptid
        };

        conn.dbQuery(conn.node_0, query, content, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });

    },

    addAppointment: (req, res) => {
        const { 
                status, TimeQueued, QueueDate, StartTime, EndTime,
                type, IsVirtual, MajorIsland, hospitalname, IsHospital
            } = req.body;

        let apptid;
        let unique = false;

        while (!unique) {
            apptid = generateHexStringApptid();
            unique = isApptidUnique(apptid);
        }

        const content = { 
            status, TimeQueued, QueueDate, StartTime, EndTime,
            type, IsVirtual, MajorIsland, hospitalname, IsHospital
        };

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
        TimeQueued = formatDateTime(TimeQueued);
        QueueDate = formatDateTime(QueueDate);
        StartTime = formatDateTime(StartTime);
        EndTime = formatDateTime(EndTime);

        const query = `
            INSERT INTO node0_db 
            (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        
        // dbQuery will push `content` into `query`
        conn.dbQuery(conn.node_0, query, content, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });

        
    },

};

module.exports = controller;