require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

const router = require('./src/router/router.js');

async function startServer() {
    app.set('view engine', 'ejs');
    app.set('views', './src/views/');
    app.use(express.static('public'));
    app.use(cors());
    app.use(express.json());
    app.use(router);

    app.listen(port, () => {
        console.log(`🚀 Server ready at: http://localhost:${port}`);
    });
};

startServer();