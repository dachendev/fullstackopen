import patients from "../data/patients";
import {
  Entry,
  NewEntry,
  NewPatient,
  Patient,
  PatientNonSensitive,
} from "../types";
import { v4 as uuid } from "uuid";

const getPatients = (): Patient[] => patients;

const getPatientsNonSensitive = (): PatientNonSensitive[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findPatientById = (id: string) => {
  return patients.find((p) => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntryToPatient = (patient: Patient, entry: NewEntry): Entry => {
  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientsNonSensitive,
  findPatientById,
  addPatient,
  addEntryToPatient,
};
