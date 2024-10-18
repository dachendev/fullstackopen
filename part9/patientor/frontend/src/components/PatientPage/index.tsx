import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Diagnosis, EntryFormValues, Patient } from "../../types";
import AddEntryForm from "../AddEntryForm";
import GenderIcon from "../GenderIcon";
import PatientEntry from "./PatientEntry";

interface Props {
  diagnoses: Record<string, Diagnosis>;
}

const PatientPage = ({ diagnoses }: Props) => {
  const patientId = useParams().id!;
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState("");

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
    return <div>patient not found</div>;
  }

  const submitNewEntry = async (values: EntryFormValues): Promise<void> => {
    try {
      const addedEntry = await patientService.createEntry(patientId, values);
      const nextEntries = patient.entries.concat(addedEntry);
      setPatient({ ...patient, entries: nextEntries });
    } catch (ex) {
      if (ex instanceof AxiosError) {
        const errorMessage = ex.response?.data?.error?.[0]?.message;
        if (typeof errorMessage === "string") {
          console.error(errorMessage);
          setError(errorMessage);
        } else {
          setError("unknown Axios error");
        }
      } else {
        console.error("unknown error", ex);
        setError("unknown error");
      }
    }
  };

  return (
    <div>
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>add entry</h3>
      <AddEntryForm onSubmit={submitNewEntry} error={error} />
      <h3>entries</h3>
      {patient.entries.map((entry) => (
        <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;
