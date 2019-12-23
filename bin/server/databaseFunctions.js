const sqlite = require("sqlite3").verbose();

const DATABASE_PATH = "codeBlocks.db";

function OpenDatabase() {
  this.db = new sqlite.Database(DATABASE_PATH, (err) => {

    if(err) {
      console.log("Could not connect to database: " + err);
      return null;
    } else {
      return this.db;
    }
  });

  return this.db;
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

    let db = OpenDatabase();

    db.run(sql_entry, {
      $url: data.url,
      $name: data.pasteName,
      $description: data.pasteDescription,
      $code: data.code,
      $codeType: data.codeType
    });
    db.run('COMMIT TRANSACTION;');

    // TODO: Close
  },
  // Creates the database
  CreateDatabase: function() {
    console.log("Creating the database schema");

    sql_entry = "CREATE TABLE IF NOT EXISTS codeBlocks (url TEXT PRIMARY KEY, name TEXT, description TEXT, code TEXT, codeType TEXT)";

    let db = OpenDatabase();
    db.run(sql_entry);
    db.run('COMMIT TRANSACTION;');
  },
  Internal_OpenDatabase: function(sql) {
    return OpenDatabase(sql);
  },
  getPaste: function(url, callback) {
    var data = [];

    let db = new sqlite.Database(DATABASE_PATH);

    db.serialize(function() {
      let sql = "SELECT * FROM codeBlocks WHERE url=$url";

      db.each(sql, [url], function(err, row) {
        data.push(row);
      }, function() {
        db.close();
        callback(data);
      });
    });
  },
  getTableCount: function(callback) {
    var count = 0;

    let db = new sqlite.Database("codeBlocks.db");

    db.serialize(function() {
      let sql = "SELECT * FROM codeBlocks";

      db.each(sql, function(err, row) {
        count += 1;
      }, function() {
        db.close();
        callback(count);
      });
    });
  }
}
