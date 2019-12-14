const utilities = require("../Utilities/utilities.js");

// Database Functions Imports
const database = require("./databaseFunctions.js");

const URL_LENGTH = "10"; // Length of the URL generated for each paste

module.exports = {

  GenerateNewPaste: function(paste, response) {

    const code = paste.code;
    const codeType = paste.codeType;

    // Create data object
    let data = {
      url: utilities.GenerateRandomString(URL_LENGTH),
      code: code,
      codeType: codeType
    }

    // Write it to database
    database.WriteToDatabase(data);

    // Redirect client via response
    response.json({
      status: "success",
      responseType: "REDIRECT",
      redirectRoute: "/p/" + data.url
    });
  }
}
