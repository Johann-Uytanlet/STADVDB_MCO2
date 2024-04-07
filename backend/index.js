const express = require("express");
const cors = require("cors");
const executeQuery = require('./config/conn.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        // Execute query
        const results = await executeQuery('SELECT * FROM node2_db LIMIT 5;');
        res.json(results);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8800, () => {
    console.log("Connected to backend");
});
