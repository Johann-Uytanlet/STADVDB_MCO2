const express = require('express');
const router = express.Router();

const controller = require('../controller/controller.js');
// const middleware = require("../controller/middleware.js");

// Add endpoints as necessary
// e.g router.post('/addAppointment', MasterController.addAppointment);

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;