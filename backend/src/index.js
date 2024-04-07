const express = require("express");
const cors = require("cors");
const executeQuery = require('./config/conn.js');

const app = express();
const PORT = 8800;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to format query results into an HTML table
function formatResults(results) {
    let tableHTML = '<table border="1">';
    // Table header
    tableHTML += '<tr>';
    for (const column of Object.keys(results[0])) {
        tableHTML += `<th>${column}</th>`;
    }
    tableHTML += '</tr>';
    // Table body
    for (const row of results) {
        tableHTML += '<tr>';
        for (const value of Object.values(row)) {
            tableHTML += `<td>${value}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    return tableHTML;
}

// HTML form to enter the query
function getQueryForm(resultsTable = '') {
    return `
        <form action="/" method="post">
            <label for="query">Enter your query:</label><br>
            <input type="text" id="query" name="query" size="50"><br><br>
            <button type="submit">Execute Query</button>
            <button type="button" id="clearResults">Clear Results</button>
        </form>
        <div id="queryResults">${resultsTable}</div>
        <script>
            const clearResultsButton = document.getElementById("clearResults");
            clearResultsButton.addEventListener("click", () => {
                document.getElementById("queryResults").innerHTML = "";
            });
        </script>
    `;
}

app.get("/", (req, res) => {
    res.send(getQueryForm());
});

// Handle form submission
app.post("/", async (req, res) => {
    const query = req.body.query;
    try {
        // Execute query
        const results = await executeQuery(query);
        // Format results into HTML table
        const resultsTable = formatResults(results);
        // Send HTML form with results table
        res.send(getQueryForm(resultsTable));
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log("🚀 Server ready at: http://localhost:" + PORT);
});
