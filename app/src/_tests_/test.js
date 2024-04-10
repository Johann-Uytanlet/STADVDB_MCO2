const { node_0, node_1, node_2, dbQuery, getConnection}  = require('../config/conn.js');
const controller = require('../controller/controller.js');



req = {body: '000019E8D2903D7A8D69B782507287E7'};
req = {body: 'asdfasfdasdf'};
res = {};
async function main(){

    // testing search

    //await controller.searchAppointment(req, res);
    //console.log("ASDFsafsdfasdfasdf");
    //console.log(res);
    // console.log(res.result[0].length); // if 0 no search, else found
    //if()
    //console.log(res.result[0][0]); // HOW TO GET THE OBJECT
    /*
    if(result[0][0]){
        console.log("YEAHHH");
    } else {
        console.log("NOOOO");
    }*/
    //console.log(res.result[0][0].apptid);


    // testing update

    //req.id = '000019E8D2903D7A8D69B782507287E7'
    //req.body = {status: 'AAAAAAAAAAAAAAAAAAAAAAAAAAA', type: 'asdfasdf'};

    //await controller.updateAppointment(req, res);
    //console.log(res);

    // is appidunique test

    //await controller.isApptidUnique(req, res);
    //console.log(res.result[0][0].count);


    // Insert

    
    const testData = {
        body: {
          status: "Pending",
          TimeQueued: new Date("2024-04-10T10:00:00.000Z"), // Replace with your desired date and time
          QueueDate: new Date("2024-04-11T08:00:00.000Z"), // Replace with your desired date and time
          StartTime: new Date("2024-04-11T15:00:00.000Z"), // Replace with your desired date and time
          EndTime: new Date("2024-04-11T15:30:00.000Z"), // Replace with your desired date and time
          type: "Checkup",
          IsVirtual: 1,
          MajorIsland: "Visayas",
          hospitalname: "Central General Hospital",
          IsHospital: 1
        }
      };
    
    res = {};
    await controller.addAppointment(testData, res);
    console.log(res);
    

    /*
    req = {body: '76411B02B21C017C755605F6EBDD7888'};
    res = {};
    await controller.deleteNodeDB(req, res);
    console.log(res.result[0].affectedRows);
    */
}
    

main();
