const { conn_num, current_node, node_0, node_1, node_2, dbQuery, getConnection } = require('../config/conn.js');
const helper = require("./helper.js");

// TODO: Replace the if-else statements in the (err, result) anonymous functions to respond with the appropriate status codes and data.
/*
    TODO: Add/Implement the following functions
        - searchNodeDBPerPage
*/
const mysql = require("mysql2");
const conn = require("../config/conn.js");

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
                limit = 10;

                sql = `SELECT * FROM node${conn_num}_db LIMIT ${limit} FOR UPDATE;`;

                viewPartialAppointments = await dbQuery(current_node, sql, content, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return result[0];
                    }
                });

                console.log(viewPartialAppointments)

                viewPartialAppointments.forEach(item => {
                    if (item.TimeQueued != null) { item.TimeQueued = item.TimeQueued.toLocaleString(); }
                    if (item.QueueDate != null) { item.QueueDate = item.QueueDate.toLocaleString(); }
                    if (item.StartTime != null) { item.StartTime = item.StartTime.toLocaleString(); }
                    if (item.EndTime != null) { item.EndTime = item.EndTime.toLocaleString(); }
                });

                res.render('./index.ejs', { viewApp: viewPartialAppointments, avg_consultation_time: avg_consultation_time, avg_queue_time: avg_queue_time, completed: completed });

            } else {

                pageNum = req.query.page
                limit = 10;
                offset = (pageNum - 1) * limit;

                sql = `SELECT * FROM node${conn_num}_db LIMIT ${limit} OFFSET ${offset} FOR UPDATE;`;

                viewPartialAppointments = await dbQuery(current_node, sql, content, (err, result) => {
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

                res.status(201).json({ viewApp: viewPartialAppointments });
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

        const sql = `SELECT COUNT(*) AS count FROM node${conn_num}_db WHERE apptid = \'${apptid}\' FOR UPDATE;`;

        await dbQuery(current_node, sql, apptid, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.result = result;
                return result;
            }
        });
    },

    searchAppointment: async (req, res) => {
        try {
            const apptid = req.body.apptid;
            const nodeNum = req.body.nodeNum;

            console.log(nodeNum);


            let sql;

            let curr_node;

            switch (nodeNum) {
                case 0:
                    curr_node = node_0;
                    sql = `SELECT * FROM node${nodeNum}_db WHERE apptid = '${apptid}' FOR UPDATE;`;
                    break;
                case 1:
                    curr_node = node_1;
                    sql = `SELECT * FROM node${nodeNum}_db WHERE apptid = '${apptid}' FOR UPDATE;`;
                    break;
                case 2:
                    curr_node = node_2;
                    sql = `SELECT * FROM node${nodeNum}_db WHERE apptid = '${apptid}' FOR UPDATE;`;
                    break;
                default:
                    curr_node = node_0;
                    sql = `SELECT * FROM node0_db WHERE apptid = '${apptid}' FOR UPDATE;`;
                    break;
            }

            await conn.dbQuery(curr_node, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result[0].length > 0) {
                        const appointment = result[0];
                        console.log(appointment[0].TimeQueued);
                        res.status(200).json(appointment[0]);

                    } else {
                        console.log("no")
                        res.status(200).json([]);
                    }
                }
            });

        } catch (error) {
            console.log(error);
        }
    },


    updateAppointment: async (req, res) => {
        // Build the SET clause dynamically, ensuring valid fields and data types
        data = req.body
        apptid = req.body.apptid

        let setClause = "";
        const values = [];

        for (const key in data) {
            if (
                Object.values(data).length > 0 &&
                !key.includes(" ") && ["status", "TimeQueued", "QueueDate", "StartTime", "EndTime", "type", "IsVirtual", "hospitalname", "IsHospital", "MajorIsland"].includes(key)
            ) {
                if (typeof data[key] === "string") {
                    setClause += `${key} = \'${data[key]}\',`;
                } else if (data[key] instanceof Date) {
                    const year = data[key].getFullYear();
                    const month = String(data[key].getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
                    const day = String(data[key].getDate()).padStart(2, '0'); // Add leading zero for single-digit days
                    const hours = String(data[key].getHours()).padStart(2, '0'); // Add leading zero for single-digit hours
                    const minutes = String(data[key].getMinutes()).padStart(2, '0'); // Add leading zero for single-digit minutes
                    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:00`; // Add seconds as 00 (if not required)
                    setClause += `${key} = ${dateString},`;
                    //values.push(dateString);
                } else {
                    setClause += `${key} = ${data[key]},`;
                    //values.push(data[key]); // Handle dates
                }
            } else {
                console.warn(`Invalid field or data type: ${key}`);
            }
        }

        // Remove trailing comma from SET clause if any
        setClause = setClause.slice(0, -1);

        // console.log(setClause);

        const current_appointment = await helper.searchById(apptid);

        if (current_appointment != null) {

            if (conn_num == 0) {
                const sql = `UPDATE node0_db SET ${setClause} WHERE apptid = \'${apptid}\';`;

                console.log(sql);

                await dbQuery(current_node, sql, apptid, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        console.log("Update in Table 0");
                        res.status(201).json(result);
                    }
                }
                );


                if (data.MajorIsland == 'Luzon') {
                    const sql = `UPDATE node1_db SET ${setClause} WHERE apptid = \'${apptid}\';`;
                    await dbQuery(current_node, sql, apptid, (err, result) => {
                        if (err) {
                            console.log(err);
                            //console.log("inside");
                        } else {
                            console.log(result);
                            console.log("Update in Table 1");
                        }
                    }
                    );
                } else if (data.MajorIsland == 'Visayas' || data.MajorIsland == 'Mindanao') {
                    const sql = `UPDATE node2_db SET ${setClause} WHERE apptid = \'${apptid}\';`;

                    await dbQuery(current_node, sql, apptid, (err, result) => {
                        if (err) {
                            console.log(err);
                            //console.log("inside");
                        } else {
                            console.log(result);
                            console.log("Update in Table 2");
                        }
                    }
                    );
                }
            } else {
                console.log("Cannot do UPDATE in Slave Node");
            }
        }

        // }
    },

    addAppointment: async (req, res) => {
        const {
            status, TimeQueued, QueueDate, StartTime, EndTime,
            type, IsVirtual, MajorIsland, hospitalname, IsHospital
        } = req.body;

        // console.log(req.body);

        let apptid;
        let unique = 1;

        while (unique != 0) {
            apptid = helper.generateHexStringApptid();
            req1 = { body: apptid };
            res1 = {};
            await controller.isApptidUnique(req1, res1);
            unique = res1.result[0][0].count
        }

        if (conn_num == 0) {
            const sql = `INSERT INTO node${conn_num}_db (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital) VALUES (\'${apptid}\', \'${status}\', \'${TimeQueued}\', \'${QueueDate}\', \'${StartTime}\', \'${EndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});`;

            await dbQuery(current_node, sql, apptid, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Insert in Table 0");
                    return res.status(201).json({ message: "Appointment created", apptid: apptid });
                }
            });

            if (MajorIsland == 'Luzon') {

                const sql = `INSERT INTO node1_db (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital) VALUES (\'${apptid}\', \'${status}\', \'${TimeQueued}\', \'${QueueDate}\', \'${StartTime}\', \'${EndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});`;

                await dbQuery(current_node, sql, apptid, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Luzon: Insert in Table 1");
                    }
                });

            } else if (MajorIsland == 'Visayas' || MajorIsland == 'Mindanao') {

                const sql = `INSERT INTO node2_db (apptid, status, TimeQueued, QueueDate, StartTime, EndTime, type, IsVirtual, MajorIsland, hospitalname, IsHospital)VALUES (\'${apptid}\', \'${status}\', \'${TimeQueued}\', \'${QueueDate}\', \'${StartTime}\', \'${EndTime}\', \'${type}\', ${IsVirtual}, \'${MajorIsland}\', \'${hospitalname}\', ${IsHospital});`;

                await dbQuery(current_node, sql, apptid, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Visayas/Mindanao: Insert in Table 2");

                    }
                });
            }
        } else {
            console.log("Slave Node " + conn_num + " cannot do write process")
        }
    },

    deleteNodeDB: async (req, res) => {
        console.log("DELETE FUNCTION");
        const apptid = req.body;

        const appointment = await helper.searchById(apptid.apptid);

        if (conn_num == 0) {
            if (appointment.length > 0) {
                const sql = `DELETE FROM node${conn_num}_db WHERE apptid = '${appointment[0].apptid}';`;

                await dbQuery(current_node, sql, {}, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Delete in Table 0");
                    }
                }
                );
            }
            if (appointment[0].MajorIsland == 'Luzon') {
                const sql = `DELETE FROM node1_db WHERE apptid = '${appointment[0].apptid}';`;
                await dbQuery(current_node, sql, {}, (err, result) => {
                    if (err) {
                        console.log(err);

                    } else {
                        console.log("Delete in Table 1");
                    }
                }
                );
            } else if (appointment[0].MajorIsland == 'Visayas' || appointment[0].MajorIsland == 'Mindanao') {
                const sql = `DELETE FROM node2_db WHERE apptid = '${appointment[0].apptid}';`;
                await dbQuery(current_node, sql, {}, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Delete in Table 2");
                    }
                }
                );
            }
        } else {
            console.log("Cannot do DELETE in Slave Node");
        }
    },

    avg_consultation_time: async (req, res) => {
        const sql = `SELECT AVG(TIMESTAMPDIFF(HOUR, StartTime, EndTime)) AS avg_consultation_time FROM node${conn_num}_db FOR UPDATE;`;

        await dbQuery(current_node, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.result = result;
            }
        }
        );
    },

    avg_queue_time: async (req, res) => {
        const sql = `SELECT AVG(TIMESTAMPDIFF(HOUR, TimeQueued, QueueDate)) AS avg_queue_time FROM node${conn_num}_db FOR UPDATE;`;

        result = {}
        result2 = {}

        await dbQuery(current_node, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);
                res.result = result;
            }
        }
        );
    },

    completed_over_total: async (req, res) => {
        var sql = `SELECT COUNT(*) as total FROM node${conn_num}_db FOR UPDATE;`;
        okay = false;
        okay2 = false;

        await dbQuery(current_node, sql, 'apptid', (err, result) => {
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
        sql = `SELECT COUNT(*) as total FROM node${conn_num}_db WHERE status = 'Complete' FOR UPDATE;`;
        await dbQuery(current_node, sql, 'apptid', (err, result) => {
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

    recoverFromLogs: async (req, res) => {
        start = req.start;

        okay = false;
        var queries;

        const sql = `SELECT statement FROM mco2.appointment_logs WHERE date_log > '${start}'`;

        await dbQuery(node_0, sql, 'apptid', (err, result) => {
            if (err) {
                console.log(err);
                console.log("Searching for appoitnment logs error");
                //console.log("inside");
            } else {
                //console.log(result);
                console.log("found logs");

                res.result = result[0];
                queries = result[0];
                okay = true;

                console.log(queries);
            }
        });
        console.log("before okay");

        if(okay){
            console.log("In okay");
            //console.log(queries[0].statement);
            for (x in queries) {
                //console.log("query");
                //console.log(queries[x].statement);

                await dbQuery(node_0, queries[x].statement, 'apptid', (err, result) => {
                    if (err) {
                        console.log(err);
                        //console.log("Searching for appoitnment logs error");
                        //console.log("inside");
                    } else {
                        //console.log(result);
                        console.log("logged");
                    }
                });
            }
        }
    }



};

module.exports = controller;