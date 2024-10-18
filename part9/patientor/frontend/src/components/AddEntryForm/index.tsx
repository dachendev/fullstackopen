import {
  Alert,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Diagnosis, Entry, EntryFormValues } from "../../types";
import AddEntryOfTypeForm from "./AddEntryOfTypeForm";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  error: string;
  diagnoses: Record<string, Diagnosis>;
}

const entryTypeOptions: Entry["type"][] = [
  "HealthCheck",
  "OccupationalHealthcare",
  "Hospital",
] as const;

const isEntryType = (a: unknown): a is Entry["type"] => {
  return (
    typeof a === "string" && entryTypeOptions.indexOf(a as Entry["type"]) !== -1
  );
};

const AddEntryForm = ({ onSubmit, error, diagnoses }: Props): JSX.Element => {
  const [type, setType] = useState<Entry["type"]>("HealthCheck");

  const onTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (isEntryType(event.target.value)) {
      setType(event.target.value);
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed grey" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography component="label">type</Typography>
        <RadioGroup value={type} onChange={onTypeChange}>
          {entryTypeOptions.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio />}
              label={type}
            />
          ))}
        </RadioGroup>
        <AddEntryOfTypeForm
          type={type}
          onSubmit={onSubmit}
          diagnoses={diagnoses}
        />
      </Box>
    </Box>
  );
};

export default AddEntryForm;
