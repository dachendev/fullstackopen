import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Record<string, Diagnosis>;
}

const PatientEntry = ({ entry, diagnoses }: Props) => {
  if (entry.type === "HealthCheck") {
    return (
      <div>
        <p>
          {entry.date} <em>{entry.description}</em>
        </p>
      </div>
    );
  }

  if (entry.type === "Hospital") {
    return (
      <div>
        <p>
          {entry.date} <em>{entry.description}</em>
        </p>
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses[code].name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (entry.type === "OccupationalHealthcare") {
    return (
      <div>
        <p>
          {entry.date} <em>{entry.description}</em>
        </p>
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>
                {code} {diagnoses[code].name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const _exhaustiveCheck: never = entry;
  return _exhaustiveCheck;
};

export default PatientEntry;
