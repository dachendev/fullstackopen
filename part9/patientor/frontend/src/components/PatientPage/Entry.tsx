import { Entry } from "../../types";

const PatientEntry = ({ entry }: { entry: Entry }) => {
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
            <li key={code}>{code}</li>
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
              <li key={code}>{code}</li>
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
