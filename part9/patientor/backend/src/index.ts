import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { errorMiddleware, newPatientParser } from "./middleware";
import diagnosisService from "./services/diagnosisService";
import patientService from "./services/patientService";
import { NewEntry, NewPatient } from "./types";
import { NewEntrySchema } from "./utils";

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

app.get("/api/patients/:id", (req, res) => {
  const patientId = req.params.id;
  const patient = patientService.findPatientById(patientId);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: "not found" });
  }
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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

app.post(
  "/api/patients/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response) => {
    const patientId = req.params.id;

    const patient = patientService.findPatientById(patientId);
    if (!patient) {
      res.status(404).json({ error: "patient not found" });
      return;
    }

    try {
      const addedEntry = patientService.addEntryToPatient(patient, req.body);
      res.json(addedEntry);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
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
