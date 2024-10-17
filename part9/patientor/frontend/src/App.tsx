import { Button, Container, Divider, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { apiBaseUrl } from "./constants";
import { Diagnosis, Patient } from "./types";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";
import diagnosisService from "./services/diagnoses";
import patientService from "./services/patients";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>({});

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchDiagnosisList = async () => {
      const diagnoses = await diagnosisService.getAll();
      // convert to hashmap for O(1) lookup
      const diagnosisMap = diagnoses.reduce((map, diagnosis) => {
        map[diagnosis.code] = diagnosis;
        return map;
      }, {} as Record<string, Diagnosis>);
      setDiagnoses(diagnosisMap);
    };
    fetchDiagnosisList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route
              path="/:id"
              element={<PatientPage diagnoses={diagnoses} />}
            />
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
