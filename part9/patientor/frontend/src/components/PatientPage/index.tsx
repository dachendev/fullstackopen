import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Diagnosis, Patient } from "../../types";
import GenderIcon from "../GenderIcon";
import PatientEntry from "./Entry";

interface Props {
  diagnoses: Record<string, Diagnosis>;
}

const PatientPage = ({ diagnoses }: Props) => {
  const patientId = useParams().id;
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (patientId) {
        const patient = await patientService.getById(patientId);
        setPatient(patient);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (!patient) {
    return <div>not found</div>;
  }

  return (
    <div>
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries.map((entry) => (
        <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;
