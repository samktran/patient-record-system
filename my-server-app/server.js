var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var db = require("./database.js");

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8080;

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// list all patients
app.get("/patients", (req, res, next) => {
  console.log("SELECT Patient.");
  let sql = `SELECT name, treatid, category FROM patient ORDER BY name`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a single patient by name
app.get("/patients/:name", (req, res, next) => {
  var sql = "select * from patient where name = ?";
  var params = [req.params.name];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

// Create a new patient
app.post("/patient/", (req, res, next) => {
  var errors = [];
  if (!req.body.name) {
    errors.push("Name for patient not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    name: req.body.name,
    treatid: req.body.treatID,
    category: req.body.category,
  };
  var sql = "INSERT INTO patient (name, treatid, category) VALUES (?,?,?)";
  var params = [data.name, data.treatid, data.category];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

// update patient
app.put("/updatePatient/:name", (req, res, next) => {
  console.log("UPDATE Patient:" + req.params.name);
  var data = {
    name: req.body.name,
    treatid: req.body.treatID,
    category: req.body.category,
  };
  console.log("UPDATE Patient: data.name = " + data.name);
  db.run(
    `UPDATE patient set 
           name = COALESCE(?,name), 
           treatid = COALESCE(?,treatid),
           category = COALESCE(?,category)
             WHERE name = ?`,
    [data.name, data.treatid, data.category, req.params.name],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

// delete patient
app.delete("/deletePatient/:name", (req, res, next) => {
  console.log("DELETE Patient:" + req.params.name);

  db.run(
    "DELETE FROM patient WHERE name = ?",
    req.params.name,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
