import { LocalHospital } from "@mui/icons-material";
import { Diagnosis, HospitalEntry } from "../../types";

interface Props {
  entry: HospitalEntry;
  diagnoses: Record<string, Diagnosis>;
}

const HospitalEntryDetails = ({ entry, diagnoses }: Props) => {
  return (
    <>
      <div>
        {entry.date} <LocalHospital />
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </ul>
      <div>
        discharge: {entry.discharge.date} {entry.discharge.criteria}
      </div>
      <div>diagnose by {entry.specialist}</div>
    </>
  );
};

export default HospitalEntryDetails;
