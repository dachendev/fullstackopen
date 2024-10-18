import { Diagnosis, Entry, EntryFormValues } from "../../types";
import AddHealthCheckEntryForm from "./AddHealthCheckEntryForm";
import AddHospitalEntryForm from "./AddHospitalEntryForm";
import AddOccupationalHealthcareEntryForm from "./AddOccupationalHealthcareEntryForm";

interface AddEntryOfTypeForm {
  type: Entry["type"];
  onSubmit: (values: EntryFormValues) => Promise<void>;
  diagnoses: Record<string, Diagnosis>;
}

const AddEntryOfTypeForm = ({
  type,
  onSubmit,
  diagnoses,
}: AddEntryOfTypeForm): JSX.Element => {
  switch (type) {
    case "HealthCheck":
      return <AddHealthCheckEntryForm onSubmit={onSubmit} />;
    case "Hospital":
      return <AddHospitalEntryForm onSubmit={onSubmit} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return (
        <AddOccupationalHealthcareEntryForm
          onSubmit={onSubmit}
          diagnoses={diagnoses}
        />
      );
  }

  const _exhaustiveCheck: never = type;
  return _exhaustiveCheck;
};

export default AddEntryOfTypeForm;
