const { node_0, node_1, node_2, dbQuery, getConnection}  = require('../config/conn.js');
const controller = require('../controller/controller.js');



req = {start: '2024-04-12 09:17:43'};
//req = {body: 'asdfasfdasdf'};
res = {};
async function main(){

    await controller.recoverFromLogs(req , res);

};

main();