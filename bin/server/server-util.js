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
      url: GenerateRandomString(URL_LENGTH),
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

function GenerateRandomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
