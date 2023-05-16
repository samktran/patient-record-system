// import node.js package module to interact with sqlite database
const sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database("patientrecords.db");

let sql = `SELECT name, treatID, category FROM patient
           ORDER BY name`;

// return all rows that match sql query and logs strings to console
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(
      "name=" +
        row.name +
        " treatID=" +
        row.treatid +
        " category=" +
        row.category
    );
  });
});

// close the database connection
db.close();
