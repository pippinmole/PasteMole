const sqlite = require("sqlite3").verbose();

const DATABASE_PATH = "codeBlocks.db";

function OpenDatabase(callback) {
  this.db = new sqlite.Database(DATABASE_PATH, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
    if(!err){
     console.log("Successfully created DB file: " + DATABASE_PATH);
    } else {
      console.log("Failed to create DB file: " + DATABASE_PATH + ". Error: " + err );
    }
  });

  callback(this.db);
  this.db.close();
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

    const sql_entry = "INSERT INTO codeBlocks (url, name, description, code, codeType, passworded) VALUES ($url, $name, $description, $code, $codeType)";
    //const sql_entry = "INSERT INTO codeBlocks (url, name, description, code, codeType, passworded) VALUES ($url, $name, $description, $code, $codeType, $passworded)";

    OpenDatabase((db) => {

      db.run("BEGIN;")

      db.run(sql_entry, {
        $url: data.url,
        $name: data.pasteName,
        $description: data.pasteDescription,
        $code: data.code,
        $codeType: data.codeType,
        $passworded: data.passworded
      });

      db.run("COMMIT;");
    });
  },
  // Creates the database
  CreateDatabase: function() {
    console.log("Creating the database schema: " + __dirname + "/" + DATABASE_PATH);

    //const sql_entry = "CREATE TABLE IF NOT EXISTS codeBlocks (url TEXT PRIMARY KEY, name TEXT, description TEXT, code TEXT, codeType TEXT, passworded BOOLEAN)";
    const sql_entry = "CREATE TABLE IF NOT EXISTS codeBlocks (url TEXT PRIMARY KEY, name TEXT, description TEXT, code TEXT, codeType TEXT)";

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
