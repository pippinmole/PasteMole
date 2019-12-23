const sqlite = require("sqlite3").verbose();

const DATABASE_PATH = "codeBlocks.db";

function OpenDatabase(callback) {
  this.db = new sqlite.Database(DATABASE_PATH, (err) => {

    if(err) {
      console.log("Could not connect to database: " + err);
      this.db.close();
      return null;
    } else {
      callback(this.db);
      this.db.close();
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

    let sql_entry = "INSERT INTO codeBlocks (url, name, description, code, codeType) VALUES ($url, $name, $description, $code, $codeType)";

    OpenDatabase((db) => {
      db.run(sql_entry, {
        $url: data.url,
        $name: data.pasteName,
        $description: data.pasteDescription,
        $code: data.code,
        $codeType: data.codeType
      });
    });
  },
  // Creates the database
  CreateDatabase: function() {
    console.log("Creating the database schema");

    sql_entry = "CREATE TABLE IF NOT EXISTS codeBlocks (url TEXT PRIMARY KEY, name TEXT, description TEXT, code TEXT, codeType TEXT)";

    OpenDatabase((db) => {
      db.run(sql_entry);
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
