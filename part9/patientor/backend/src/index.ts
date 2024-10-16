import express from "express";
import cors from "cors";
import diagnosisService from "./services/diagnosisService";
import patientService from "./services/patientService";

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/ping", (_, res) => {
  res.send("pong!");
});

app.get("/api/diagnoses", (_, res) => {
  res.json(diagnosisService.getDiagnoses());
});

app.get("/api/patients", (_, res) => {
  res.json(patientService.getPatientsNonSensitive());
});

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
