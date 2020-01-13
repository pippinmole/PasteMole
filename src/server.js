// APP SETUP
const express = require('express');
const app = express();

// Utilities.js
const serverutilities = require("./server/server-util.js");

// Database Functions Imports
const sqlite = require("sqlite3").verbose();
const database = require("./server/databaseFunctions.js");
database.CreateDatabase();

// Template Imports
const pug = require("pug");

// APP CONSTANTS
const SERVER_BANDWIDTH_LIMIT = "20mb"; // Limits the client post bandwidth

app.set("view engine", "pug");

// DYNAMIC APP VARIABLES
let CURRENT_PASTES_AVAILABLE = 0;

database.getTableCount((tableCount) => {
  CURRENT_PASTES_AVAILABLE = tableCount;
})

// Start listening on PORT
// ::5000 -> PasteMole
// ::5500 -> Portfolio
app.listen(5000, () => console.log("Listening on 5000"));

// Redirect incoming clients to default(index.html) inside 'client' folder
app.use(express.static(__dirname + "/client/"));
app.use(express.json({
  // Protects clients from sending loads of data at once
  limit: SERVER_BANDWIDTH_LIMIT
}));

// Sending stuff to the client
app.post('/', (request, response) => {
  if(request == undefined) {
    console.log("Recieved undefined request.");
  } else {
    //console.log("Recieved valid request: " + request);

    const paste = request.body;

    // Generate new paste
    serverutilities.GenerateNewPaste(paste, response, (successful) => {
      if(successful) {
        console.log("Creating paste: " + paste.pasteData.pasteName);
        CURRENT_PASTES_AVAILABLE += 1;
      }
    });
  }

  console.log("Current Pastes: " + CURRENT_PASTES_AVAILABLE);
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
        pasteName: paste.name,
        pasteDescription: paste.description,
        pasteContents: paste.code,
        pasteType: paste.codeType,
        passworded: paste.passworded
      }

      // Send the response back to the client
      response.render(__dirname + "/client/views/codeTemplate", _render);
    }
  });
});

// Redirect all other paths to homepage (Make sure to keep this at the bottom)
app.all("*", (request, response) => {
  // Redirect client to homepage
  response.redirect(302, "../index.html");
});
