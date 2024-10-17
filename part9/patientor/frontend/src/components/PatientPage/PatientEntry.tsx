import { Diagnosis, Entry } from "../../types";
import EntryDetails from "../EntryDetails";

interface Props {
  entry: Entry;
  diagnoses: Record<string, Diagnosis>;
}

const entryStyle = {
  border: "1px solid #000",
  borderRadius: "4px",
  padding: "4px",
  marginBottom: "10px",
};

const PatientEntry = ({ entry, diagnoses }: Props) => {
  return (
    <div style={entryStyle}>
      <EntryDetails entry={entry} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientEntry;
