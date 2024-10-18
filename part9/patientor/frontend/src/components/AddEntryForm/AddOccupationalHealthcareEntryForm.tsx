import { Box, Button, Input, Typography } from "@mui/material";
import { EntryFormValues } from "../../types";
import { SyntheticEvent, useState } from "react";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
}

const AddOccupationalHealthcareEntryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const diagnosisCodesList = diagnosisCodes
      ? diagnosisCodes.split(/,\w?/g)
      : undefined;

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
      diagnosisCodes: diagnosisCodesList,
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
        <Typography component="label">Diagnosis Codes</Typography>
        <Input
          fullWidth
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value)}
        />
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
