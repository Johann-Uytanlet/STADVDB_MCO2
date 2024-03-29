const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const node1 = mysql.createConnection({
    host: '10.2.0.24',  // e.g., 'localhost'
    user: 'STADVDB08_Server0',
    password: 'ap4cAKqdRPfFv5xSg7MuW9mQ',
    database: 'mco2'
});

const node2 = mysql.createConnection({
    host: '10.2.0.25',  // e.g., 'localhost'
    user: 'STADVDB08_Server1',
    password: 'ap4cAKqdRPfFv5xSg7MuW9mQ',
    database: 'mco2'
});

const node3 = mysql.createConnection({
    host: '10.2.0.26',  // e.g., 'localhost'
    user: 'STADVDB08_Server2',
    password: 'ap4cAKqdRPfFv5xSg7MuW9mQ',
    database: 'mco2'
});


app.get("/", (req, res) => {
    res.json("hello");
  });

app.get("/profile")

app.listen(8800, ()=>{
    console.log("Connected to backend")
})