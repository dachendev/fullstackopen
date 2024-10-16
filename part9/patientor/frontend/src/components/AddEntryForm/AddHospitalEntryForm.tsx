import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Diagnosis, EntryFormValues } from "../../types";
import { SyntheticEvent, useState } from "react";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  diagnoses: Record<string, Diagnosis>;
}

const AddHospitalEntryForm = ({ onSubmit, diagnoses }: Props) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const onDiagnosisCodesChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const { value } = event.target;
    setDiagnosisCodes(typeof value === "string" ? value.split(/,\w?/g) : value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      specialist,
      description,
      diagnosisCodes,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria,
      },
      type: "Hospital",
    });
  };

  return (
    <form onSubmit={addEntry}>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">date</Typography>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">specialist</Typography>
        <Input
          type="text"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">description</Typography>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">diagnosis codes</Typography>
        <Select
          multiple
          value={diagnosisCodes}
          onChange={onDiagnosisCodesChange}
          fullWidth
          required
        >
          {Object.values(diagnoses).map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">discharge date</Typography>
        <Input
          type="date"
          value={dischargeDate}
          onChange={(e) => setDischargeDate(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">discharge criteria</Typography>
        <Input
          type="text"
          value={dischargeCriteria}
          onChange={(e) => setDischargeCriteria(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Button variant="contained" type="submit">
        Add
      </Button>
    </form>
  );
};

export default AddHospitalEntryForm;
