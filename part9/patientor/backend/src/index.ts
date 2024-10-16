import cors from "cors";
import express from "express";
import diagnosisService from "./services/diagnosisService";
import patientService from "./services/patientService";
import { toNewPatient } from "./utils";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_, res) => {
  res.send("pong!");
});

app.get("/api/diagnoses", (_, res) => {
  res.json(diagnosisService.getDiagnoses());
});

app.get("/api/patients", (_, res) => {
  res.json(patientService.getPatientsNonSensitive());
});

app.post("/api/patients", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(error.message);
    }
  }
});

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
