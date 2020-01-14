const sqlite = require("sqlite3").verbose();
const path = require('path')

const DATABASE_PATH = __dirname + "/databases/codeBlocks.db";

function OpenDatabase(callback) {
  const db = new sqlite.Database(DATABASE_PATH, (err) => {
    if(!err) {
      console.log("Successfully created database file: " + DATABASE_PATH);
    } else {
      console.log("Failed to create/open database file: " + DATABASE_PATH + ". Error: " + err);
    }
  });

  callback(db);

  db.close((err) => {
    if(!err) {
      console.log("Successfully closed database connection: " + DATABASE_PATH);
    } else {
      console.log("Failed to close database connection: " + DATABASE_PATH + ". Error: " + err);
    }
  });
}

module.exports = {
  // Exports Functions

  // Reads a new entry to the database
  //
  // format of data:
  //
  // let data = {
  //   url: "X6LF43",
  //   code: "let x = 5;",
  //   codeType: "javascript"
  // }
  //
  //
  WriteToDatabase: function(data) {

    // Get current time/date
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getYear();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const time = `${hour} : ${minute} : ${second}`;
    const date = `${day} : ${month} : ${year}`;

    const dateTime = `(${time}) : (${date})`;

    const sql_entry = "INSERT INTO codeBlocks (url, name, description, code, codeType, passworded, dateCreated) VALUES ($url, $name, $description, $code, $codeType, $passworded, $dateCreated)";

    OpenDatabase((db) => {

      db.run("BEGIN;")

      db.run(sql_entry, {
        $url: data.url,
        $name: data.pasteName,
        $description: data.pasteDescription,
        $code: data.code,
        $codeType: data.codeType,
        $passworded: data.passworded,
        $dateCreated: dateTime
      });

      db.run("COMMIT;");
    });
  },
  // Creates the database
  CreateDatabase: function() {

    const sql_entry = "CREATE TABLE IF NOT EXISTS codeBlocks (url TEXT PRIMARY KEY, name TEXT, description TEXT, code TEXT, codeType TEXT, passworded BOOLEAN, dateCreated TEXT)";

    OpenDatabase((db) => {

      console.log(db);

      db.run("BEGIN;")

      db.run(sql_entry);

      db.run("COMMIT;");
    });
  },
  getPaste: function(url, callback) {
    var data = [];

    OpenDatabase((db) => {
      db.serialize(function() {
        let sql = "SELECT * FROM codeBlocks WHERE url=$url";

        db.each(sql, [url], function(err, row) {
          console.log(row);
          data.push(row);
        }, () => {
          callback(data);
        });
      });
    });
  },
  getTableCount: function(callback) {
    var count = 0;

    OpenDatabase((db) => {
      db.serialize(function() {
        let sql = "SELECT * FROM codeBlocks";

        db.each(sql, function(err, row) {
          count += 1;
        }, function() {
          callback(count);
        });
      });
    });
  }
}
