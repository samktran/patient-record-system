// importing necessary libraries and styles
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PatientPanel.css";

// functional component named patientpanel
function PatientPanel() {
  // setting up state for the component
  const [patientName, setPatientName] = React.useState("");
  const [treatID, setTreatID] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [summary, setSummary] = useState([]);
  const [newCategory, setNewCategory] = React.useState("");
  const [notification, setNotification] = React.useState("");
  const [newFilter, setNewFilter] = useState([]);
  const [categoryInput, setCategoryInput] = React.useState("");
  const [filterNotification, setFilterNotification] = React.useState("");
  const [recordSize, setRecordSize] = React.useState("");

  // function to fetch patient records from the server
  function fetchPatientRecords() {
    axios.get("http://localhost:8080/patients").then((response) => {
      //displays the total number of patients on record
      setRecordSize(summary.length + " patient(s) in the database.");

      console.log(response);
      //using react hooks, we assign the patient records objects to the react hook 'summary'
      setSummary(response.data.data);
      console.log(summary);
    });
  }

  // function to save a patient's record to the server
  function savePatient() {
    const value = {
      name: patientName,
      treatID: treatID,
      category: category,
    };
    axios.post("http://localhost:8080/patient", value).then((response) => {
      // update notification state with the saved patient
      setNotification(response.data.message + " patient added.");
      fetchPatientRecords();
    });
  }

  // function to delete a patient's record from the server
  function deletePatient() {
    axios
      .delete(`http://localhost:8080/deletePatient/${patientName}`)
      .then((response) => {
        // update notification state with the deleted patient
        setNotification("patient " + response.data.message + " successfully.");
        fetchPatientRecords();
      });
  }

  // function to update a patient's record on the server
  function updatePatient() {
    const value = {
      name: patientName,
      treatID: treatID,
      category: category,
    };
    axios
      .put(`http://localhost:8080/updatePatient/${patientName}`, value)
      .then((response) => {
        // update notification state with the updated patient
        setNotification(response.data.message + " patient updated.");
        fetchPatientRecords();
      });
  }

  // function to filter patient's records based on category
  function filterPatient() {
    // send a GET request to server to fetch all patients' data
    axios.get("http://localhost:8080/patients").then((response) => {
      // update the filterNotification state with the number of filtered patients and the category used for filtering.
      setFilterNotification(
        newFilter.length + " patient(s) filtered by " + categoryInput + "."
      );

      // update the newCategory state with the fetched data from the server
      setNewCategory(response.data.data);

      // get all values from the newCategory object and store them in the results array.
      const results = Object.values(newCategory);

      // filter the results array to only include those patients whose category matches the categoryInput.
      const filter = results.filter((f) => {
        return f.category === categoryInput;
      });

      // Update the newFilter state with the filtered array of patients.
      setNewFilter(filter);
    });
  }

  // handler functions to handle clicks on the different buttons
  function displayPatientHandler() {
    fetchPatientRecords();
  }

  function savePatientHandler() {
    savePatient();
  }

  function deletePatientHandler() {
    deletePatient();
  }

  function updatePatientHandler() {
    updatePatient();
  }

  function filterPatientHandler() {
    filterPatient();
  }

  // function to show available categories
  const showCategory = () => {
    window.alert(
      "Available Categories to Filter By: \n • Operations \n • Consultations and check-up \n • Medicine and different types of tablets \n • Clinical reports and attached documents and history \n • Prescriptions and repeat Prescriptions"
    );
  };

  return (
    <div>
      <div>
        <h3>Records:</h3>
        <div>{recordSize}</div>
        <br />
        <br />
        {summary.map((patient) => (
          <div key={patient.treatid}>
            <h4>{patient.name}</h4>
            <p>Treatment ID: {patient.treatid}</p>
            <p>Category: {patient.category}</p>
          </div>
        ))}
        <br />
        <br />
        <button class="button-4" role="button" onClick={displayPatientHandler}>
          Display Patients
        </button>
        <br />
        <br />
        <br />
      </div>
      <h3>Patient Form:</h3>
      <div>{notification}</div>
      <br />
      <input
        type="text"
        placeholder="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Treatment ID"
        value={treatID}
        onChange={(e) => setTreatID(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br />
      <button class="button-4" role="button" onClick={savePatientHandler}>
        Save Patient
      </button>
      <br />
      <button class="button-4" role="button" onClick={deletePatientHandler}>
        Delete Patient
      </button>
      <br />
      <button class="button-4" role="button" onClick={updatePatientHandler}>
        Update Patient
      </button>
      <br />
      <br />
      <br />
      <h3>Filter Records:</h3>
      <input
        type="text"
        placeholder="Category"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
      />
      <button class="button-4" role="button" onClick={filterPatientHandler}>
        Filter Records
      </button>
      <button class="button-4" role="button" onClick={showCategory}>
        Help
      </button>
      <br />
      <br />
      <div>{filterNotification}</div>
      <br />
      {newFilter.map((patient) => (
        <div key={patient.treatid}>
          <h4>{patient.name}</h4>
          <p>Treatment ID: {patient.treatid}</p>
          <p>Category: {patient.category}</p>
        </div>
      ))}
      <br />
      <br />
    </div>
  );
}

export default PatientPanel;
