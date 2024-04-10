const { node_0, node_1, node_2, dbQuery, getConnection } = require('../config/conn.js');


// TODO: Replace the if-else statements in the (err, result) anonymous functions to respond with the appropriate status codes and data.
/*
    TODO: Add/Implement the following functions
        - searchNodeDBPerPage
*/
const mysql = require("mysql2");
const conn = require("../config/conn.js");

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

    homepage: async (req, res) => {
        try {

            // Average Consultation Time
            req1 = {};
            res1 = {}
            await controller.avg_consultation_time(req1, res1);

            const avg_consultation_time = res1.result[0][0].avg_consultation_time;
            // Average Queue Time
            req1 = {};
            res1 = {}
            await controller.avg_queue_time(req1, res1);

            //console.log(res1.result[0][0].avg_queue_time);
            const avg_queue_time = res1.result[0][0].avg_queue_time;

            // Completed Appointments/total appointment
            req1 = {};
            res1 = {}
            await controller.completed_over_total(req1, res1);

            const completed = res1.result * 100;

            // console.log(avg_consultation_time);
            // console.log(avg_queue_time);
            // console.log(completed);

            const content = {};
            let pageNum;
            let limit;
            let viewPartialAppointments;
            let offset;
            let sql;

            console.log(req.query.page)

            if (req.query.page == null) {
                pageNum = 1;
                limit = pageNum * 10;

                sql = `
                SELECT *
                FROM node0_db
                LIMIT ${limit};
                `;


                viewPartialAppointments = await dbQuery(node_0, sql, content, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return result[0];
                    }
                });


                viewPartialAppointments.forEach(item => {
                    if (item.TimeQueued !== null) { item.TimeQueued = item.TimeQueued.toLocaleString(); }
                    if (item.QueueDate !== null) { item.QueueDate = item.QueueDate.toLocaleString(); }
                    if (item.StartTime !== null) { item.StartTime = item.StartTime.toLocaleString(); }
                    if (item.EndTime !== null) { item.EndTime = item.EndTime.toLocaleString(); }
                });

                res.render('./index.ejs', { viewApp: viewPartialAppointments, avg_consultation_time: avg_consultation_time, avg_queue_time: avg_queue_time, completed: completed });

            } else {

                pageNum = req.query.page
                limit = 10;
                offset = (pageNum - 1) * limit;

                sql = `
                SELECT *
                FROM node0_db
                LIMIT ${limit}
                OFFSET ${offset};
                `;

                viewPartialAppointments = await dbQuery(node_0, sql, content, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return result[0];
                    }
                });


                viewPartialAppointments.forEach(item => {
                    if (item.TimeQueued !== null) { item.TimeQueued = item.TimeQueued.toLocaleString(); }
                    if (item.QueueDate !== null) { item.QueueDate = item.QueueDate.toLocaleString(); }
                    if (item.StartTime !== null) { item.StartTime = item.StartTime.toLocaleString(); }
                    if (item.EndTime !== null) { item.EndTime = item.EndTime.toLocaleString(); }
                });


                const numAppointment = viewPartialAppointments.length;

                console.log(viewPartialAppointments);

                res.status(201).json({ viewApp: viewPartialAppointments});
            }

            console.log(pageNum);


        }
        catch (e) {
            console.log("controller.js error");
            console.log(e);
        }
    },

    isApptidUnique: async (req, res) => {
        const apptid = req.body;

        const sql = `SELECT COUNT(*) AS count FROM node0_db WHERE apptid = \'${apptid}\';`;

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

    searchAppointment: async (req, res) => {

        try {
            const apptid = req.body.apptid;

            const sql = `
                SELECT *
                FROM node0_db
                WHERE apptid = '${apptid}';
                `;

            console.log(sql);

            conn.dbQuery(node_0, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result[0].length > 0) {
                        console.log(result)
                        const appointment = result[0];
                        res.status(200).json(appointment[0]);
                    } else {
                        console.log(result)
                        res.status(200).json([]);
                    }
                }
            });

            // console.log(appointment[0]);

        } catch (error) {
            console.log(error);
        }
    },

    searchAppointment_server1: async (req, res) => {
        const apptid = req.body;

        const sql = `SELECT * FROM node1_db WHERE apptid = '${apptid}';
        `;

        //console.log(sql);

        await dbQuery(node_1, sql, apptid, (err, result) => {
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

    searchAppointment_server2: async (req, res) => {
        const apptid = req.body;

        const sql = `SELECT * FROM node2_db WHERE apptid = '${apptid}';
        `;

        //console.log(sql);

        await dbQuery(node_2, sql, apptid, (err, result) => {
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
                } else if (data[key] instanceof Date) {
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

        // Build the SQL query using parameterized queries for security
        req1 = { body: apptid }
        res1 = {}
        await controller.searchAppointment(req1, res1);

        if (res1.result[0].length > 0) {

            const sql = `UPDATE node0_db SET ${setClause} WHERE apptid = \'${apptid}\';`;
          
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
            }
            );

            //console.log("before")
            //console.log(res1.result[0][0].MajorIsland)

            if (res1.result[0][0].MajorIsland == 'Luzon') {
                const sql = `UPDATE node1_db SET ${setClause} WHERE apptid = \'${apptid}\';
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
                }
                );
            } else if (res1.result[0][0].MajorIsland == 'Visayas' || res1.result[0][0].MajorIsland == 'Mindanao') {
                const sql = `UPDATE node2_db SET ${setClause} WHERE apptid = \'${apptid}\';`;

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
                }
                );
            }
        }
    },

    addAppointment: async (req, res) => {
        const {
            status, TimeQueued, QueueDate, StartTime, EndTime,
            type, IsVirtual, MajorIsland, hospitalname, IsHospital
        } = req.body;

        console.log(req.body);

        console.log({ status, TimeQueued, QueueDate, StartTime, EndTime,
            type, IsVirtual, MajorIsland, hospitalname, IsHospital});

        let apptid;
        let unique = 1;

        while (unique != 0) {
            apptid = generateHexStringApptid();
            req1 = { body: apptid };
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

        const sql = `INSERT INTO node0_db (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital) VALUES (\'${apptid}\', \'${status}\', \'${formattedTimeQueued}\', \'${formattedQueueDate}\', \'${formattedStartTime}\', \'${formattedEndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});
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

        if (MajorIsland == 'Luzon') {

            const sql = `INSERT INTO node1_db (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital) VALUES (\'${apptid}\', \'${status}\', \'${formattedTimeQueued}\', \'${formattedQueueDate}\', \'${formattedStartTime}\', \'${formattedEndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});`;

            await dbQuery(node_0, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                    //console.log("inside");
                } else {
                    console.log(result);
                    console.log("Luzon");
                    return res.status(201).json({ message: "Appointment created", apptid: result.apptid });
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
                    return res.status(201).json({ message: "Appointment created", apptid: result.apptid });
                }
            });
        }
    },

    deleteNodeDB: async (req, res) => {
        const apptid = req.body;

        req1 = { body: apptid }
        res1 = {}
        await controller.searchAppointment(req1, res1);

        if (res1.result[0].length > 0) {
            const sql = `DELETE FROM node0_db WHERE apptid = '${apptid}';`;

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
            }
            );

            //console.log("before")
            //console.log(res1.result[0][0].MajorIsland)

            if (res1.result[0][0].MajorIsland == 'Luzon') {
                const sql = `DELETE FROM node1_db WHERE apptid = '${apptid}';`;
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
                }
                );
            } else if (res1.result[0][0].MajorIsland == 'Visayas' || res1.result[0][0].MajorIsland == 'Mindanao') {
                const sql = `DELETE FROM node2_db WHERE apptid = '${apptid}';`;
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
                }
                );
            }
        }
    },

    avg_consultation_time: async (req, res) => {
        const sql = `SELECT AVG(TIMESTAMPDIFF(HOUR, StartTime, EndTime)) AS avg_consultation_time FROM node0_db;`;

        await dbQuery(node_0, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.result = result;
            }
        }
        );
    }, avg_queue_time: async (req, res) => {
        const sql = `SELECT AVG(TIMESTAMPDIFF(HOUR, TimeQueued, QueueDate)) AS avg_queue_time FROM node0_db;`;

        result = {}
        result2 = {}

        await dbQuery(node_0, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);
                res.result = result;
            }
        }
        );
    }, completed_over_total: async (req, res) => {
        var sql = `SELECT COUNT(*) as total FROM node0_db;`;
        okay = false;
        okay2 = false;

        await dbQuery(node_0, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
                //console.log("inside");
            } else {
                //console.log(result);
                temp = result
                okay = true;
                //console.log("inside2");
                //res.result = result;
                //return result;
            }
        }
        );
        sql = `SELECT COUNT(*) as total FROM node0_db WHERE status = 'Complete';`;
        await dbQuery(node_0, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
                //console.log("inside");
            } else {
                //console.log(result);
                temp2 = result
                okay2 = true;
                //console.log("inside2");
                //res.result = result;
                //return result;
            }
        }
        );
        if (okay && okay2) {
            res.result = temp2[0][0].total / temp[0][0].total;
            res.err = false;
        } else {
            res.err = true;
            res.result = 0
        }
    },

};


req = { body: '000019E8D2903D7A8D69B782507287E7' };
res = {};
//controller.searchAppointment(req, res);
//controller.isApptidUnique(req, res);
module.exports = controller;