import { MedicalServices } from "@mui/icons-material";
import { Diagnosis, OccupationalHealthcareEntry } from "../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Record<string, Diagnosis>;
}

const OccupationalHealthcareEntryDetails = ({ entry, diagnoses }: Props) => {
  return (
    <>
      <div>
        {entry.date} <MedicalServices /> <em>{entry.employerName}</em>
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses[code]?.name}
            </li>
          ))}
        </ul>
      )}
      {entry.sickLeave && (
        <div>
          sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      )}
      <div>diagnose by {entry.specialist}</div>
    </>
  );
};

export default OccupationalHealthcareEntryDetails;
