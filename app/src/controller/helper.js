const conn = require("../config/conn.js");
const { current_node, node_0, node_1, node_2, dbQuery, getConnection } = require('../config/conn.js');

function generateRandomHexString(length) {
    const characters = '0123456789ABCDEF';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const helper = {
    
    generateHexStringApptid() {
        return generateRandomHexString(32);
    },
    
    async searchById(id) {
    const apptid = id;

    const sql = `SELECT * FROM node0_db WHERE apptid = '${apptid}';
        `;
        
    const res = await conn.dbQuery(current_node, sql, apptid, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result[0]);
            return result[0];
        }
    })

    return res;
},
}


module.exports = helper;