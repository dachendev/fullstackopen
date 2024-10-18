import { Box, Button, Input, Typography } from "@mui/material";
import { EntryFormValues } from "../../types";
import { useState } from "react";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
}

const AddHospitalEntryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const addEntry = () => {
    onSubmit({
      date,
      specialist,
      description,
      diagnosisCodes: diagnosisCodes.split(/,\s?/g),
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
        <Input
          type="text"
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value)}
          fullWidth
          required
        />
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
