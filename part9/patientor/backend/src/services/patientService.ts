import patients from "../data/patients";
import { Patient, PatientNonSensitive } from "../types";

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

export default {
  getPatients,
  getPatientsNonSensitive,
};
