const { node_0, node_1, node_2, dbQuery, getConnection}  = require('../config/conn.js');
const controller = require('../controller/controller.js');



req = {body: '5F04266409AD193A648175E825482967'};
//req = {body: 'asdfasfdasdf'};
res = {};
async function main(){

    // testing search

    //await controller.searchAppointment_server2(req, res);
    //console.log("ASDFsafsdfasdfasdf");
    //console.log(res.result);
    //console.log(res.result[0].length); // if 0 no search, else found
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

    //req.id = '00025C50655A0FFB17C1B6DE333FC408' 
    req.body = {apptid: '00025C50655A0FFB17C1B6DE333FC408', status: 'Complete', type: 'Consultation', hospitalname: 'apptid hospital', IsHospital: 1};

    await controller.updateAppointment(req, res);
    console.log(res);
    
    // is appidunique test

    //await controller.isApptidUnique(req, res);
    //console.log(res.result[0][0].count);


    // Insert

    
    // const testData = {
    //     body: {
    //       status: "Complete",
    //       TimeQueued: new Date("2024-04-10T10:00:00.000Z"), // Replace with your desired date and time
    //       QueueDate: new Date("2024-04-11T08:00:00.000Z"), // Replace with your desired date and time
    //       StartTime: new Date("2024-04-11T15:00:00.000Z"), // Replace with your desired date and time
    //       EndTime: new Date("2024-04-11T15:30:00.000Z"), // Replace with your desired date and time
    //       type: "Consultation",
    //       IsVirtual: 1,
    //       MajorIsland: "Luzon",
    //       hospitalname: "Central General Hospital",
    //       IsHospital: 1
    //     }
    //   };
    
    // res = {};
    // await controller.addAppointment(testData, res);
    // console.log(res);
    

    // testing delete
    // req = {body: '73ED5F3C948786826AE26A446D12A727'};
    // res = {};
    // await controller.deleteNodeDB(req, res);
    // try{console.log(res.result[0].affectedRows);}
    // catch{console.log("NOOOO");}
    


    /*
    res = {};
    req = {};
    await controller.avg_consultation_time(req, res);
    console.log("asdf")
    console.log(res.result[0][0].avg_consultation_time);
    */

    /*
    res = {};
    req = {};
    await controller.avg_queue_time(req, res);
    console.log("asdf")
    console.log(res.result[0][0].avg_queue_time);*/

    /*
    res = {};
    req = {};
    await controller.completed_over_total(req, res);
    console.log("asdf")
    console.log(res.result);*/
}
    

main();
