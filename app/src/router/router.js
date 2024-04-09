const express = require('express');
const router = express.Router();

const MasterController = require('../controller/MasterController.js');
const SlaveController = require('../controller/SlaveController.js');
const middleware = require("../controller/Middleware.js");

// Add endpoints as necessary
// e.g router.post('/addAppointment', MasterController.addAppointment);

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;