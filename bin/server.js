const sqlite = require("sqlite3").verbose();

// APP CONSTANTS
const SERVER_BANDWIDTH_LIMIT = "20mb"; // Limits the client post bandwidth

// APP SETUP
const express = require('express');
const app = express();

// Utilities.js
const utilities = require("./Utilities/utilities.js");
const serverutilities = require("./server/server-util.js");

// Database Functions Imports
const database = require("./server/databaseFunctions.js");
database.CreateDatabase();

const pug = require("pug");

app.set("view engine", "pug");

// Start listening on PORT
app.listen(2000, () => console.log("Listening on 2000"));

// Redirect incoming clients to default(index.html) inside 'client' folder
app.use(express.static('./client'));
app.use(express.json({
  // Protects clients from sending loads of data at once
  limit: SERVER_BANDWIDTH_LIMIT
}));

// Sending stuff to the client
app.post('/', (request, response) => {
  if(request == undefined) {
    console.log("Recieved undefined request.");
  } else {
    console.log("Recieved valid request: " + request);

    const data = request.body;

    // Generate new paste
    serverutilities.GenerateNewPaste(data, response);
  }
});

app.get("/p/:id", (request, response) => {

  const url = request.params.id;

  // Get the data
  database.getPaste(url, (rows) => {
    if(rows == undefined || rows == 0) {
      // Redirect client to homepage
      response.redirect(302, "../index.html");
    } else {
      const paste = rows[0];

      // Send to code template (with paste object)
      const _render = {
        paste: paste.code,
        pasteType: paste.codeType
      }

      // Send the response back to the client
      response.render("codeTemplate", _render);
    }
  });
});

// Redirect all other paths to homepage (Make sure to keep this at the bottom)
app.all("*", (request, response) => {
  // Redirect client to homepage
  response.redirect(302, "../index.html");
});
