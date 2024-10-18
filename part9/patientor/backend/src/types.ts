import { z } from "zod";
import { NewEntrySchema, newPatientSchema } from "./utils";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

interface EntryBase {
  id: string;
  date: string;
  type: string;
  specialist: string;
  description: string;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

interface HealthCheckEntry extends EntryBase {
  healthCheckRating: HealthCheckRating;
  type: "HealthCheck";
}

interface OccupationalHealthcareEntry extends EntryBase {
  employerName: string;
  diagnosisCodes?: string[];
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
  type: "OccupationalHealthcare";
}

interface HospitalEntry extends EntryBase {
  diagnosisCodes: string[];
  discharge: {
    date: string;
    criteria: string;
  };
  type: "Hospital";
}

export type Entry =
  | HealthCheckEntry
  | OccupationalHealthcareEntry
  | HospitalEntry;

export type NewEntry = z.infer<typeof NewEntrySchema>;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type NewPatient = z.infer<typeof newPatientSchema>;

export type PatientNonSensitive = Omit<Patient, "ssn" | "entries">;
