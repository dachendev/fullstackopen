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

const AddOccupationalHealthcareEntryForm = ({ onSubmit, diagnoses }: Props) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const onDiagnosisCodesChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const { value } = event.target;
    setDiagnosisCodes(typeof value === "string" ? value.split(/,\w?/g) : value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const sickLeave =
      sickLeaveStartDate && sickLeaveEndDate
        ? {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          }
        : undefined;

    onSubmit({
      date,
      specialist,
      description,
      employerName,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
      sickLeave,
      type: "OccupationalHealthcare",
    });
  };

  return (
    <form onSubmit={addEntry}>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">Date</Typography>
        <Input
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">Specialist</Typography>
        <Input
          fullWidth
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">Description</Typography>
        <Input
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography component="label">Employer Name</Typography>
        <Input
          fullWidth
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
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
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography component="label">Sick Leave Start Date</Typography>
          <Input
            type="date"
            fullWidth
            value={sickLeaveStartDate}
            onChange={(e) => setSickLeaveStartDate(e.target.value)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography component="label">Sick Leave End Date</Typography>
          <Input
            type="date"
            fullWidth
            value={sickLeaveEndDate}
            onChange={(e) => setSickLeaveEndDate(e.target.value)}
          />
        </Box>
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </form>
  );
};

export default AddOccupationalHealthcareEntryForm;
