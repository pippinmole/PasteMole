const utilities = require("../Utilities/utilities.js");

// Database Functions Imports
const database = require("./databaseFunctions.js");

const URL_LENGTH = "10"; // Length of the URL generated for each paste

module.exports = {

  GenerateNewPaste: function(paste, response, callback) {

    const pasteName = paste.pasteName;
    const pasteDescription = paste.pasteDescription;
    const code = paste.code;
    const codeType = paste.codeType;

    // Create data object
    let data = {
      url: utilities.GenerateRandomString(URL_LENGTH),
      pasteName: pasteName,
      pasteDescription: pasteDescription,
      code: code,
      codeType: codeType
    }

    // Write it to database
    database.WriteToDatabase(data);

    callback(true);

    // Redirect client via response
    response.json({
      status: "success",
      responseType: "REDIRECT",
      redirectRoute: "/p/" + data.url
    });
  }
}
