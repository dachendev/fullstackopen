import cors from "cors";
import express, { Request, Response } from "express";
import { z } from "zod";
import { errorMiddleware, newPatientParser } from "./middleware";
import diagnosisService from "./services/diagnosisService";
import patientService from "./services/patientService";
import { NewPatient } from "./types";

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

app.post(
  "/api/patients",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response) => {
    try {
      const addedPatient = patientService.addPatient(req.body);
      res.json(addedPatient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues });
      } else {
        res.status(400).json({ error: "unknown error" });
      }
    }
  }
);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
