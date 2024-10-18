import { Entry, EntryFormValues } from "../../types";
import AddHealthCheckEntryForm from "./AddHealthCheckEntryForm";
import AddHospitalEntryForm from "./AddHospitalEntryForm";
import AddOccupationalHealthcareEntryForm from "./AddOccupationalHealthcareEntryForm";

interface AddEntryOfTypeForm {
  type: Entry["type"];
  onSubmit: (values: EntryFormValues) => Promise<void>;
}

const AddEntryOfTypeForm = ({
  type,
  onSubmit,
}: AddEntryOfTypeForm): JSX.Element => {
  switch (type) {
    case "HealthCheck":
      return <AddHealthCheckEntryForm onSubmit={onSubmit} />;
    case "Hospital":
      return <AddHospitalEntryForm onSubmit={onSubmit} />;
    case "OccupationalHealthcare":
      return <AddOccupationalHealthcareEntryForm onSubmit={onSubmit} />;
  }

  const _exhaustiveCheck: never = type;
  return _exhaustiveCheck;
};

export default AddEntryOfTypeForm;
