// import node.js package module to interact with sqlite database
var sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database("patientrecords.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the Patient database.");
});

// create table 'patient'
const sql = "CREATE TABLE patient(name text, treatid text, category text)";
db.run(sql, (err) => {
  if (err) {
    // Table already created
    console.log("Table already created.");
  } else {
    console.log("Table created.");

    // prepare sql statement for inserting rows
    console.log("First time Table created, creating some rows.");

    var insert = "INSERT INTO patient(name, treatid, category) VALUES(?,?,?)";
  }
});

// export as module, called db, to allow connection to patient table
module.exports = db;
