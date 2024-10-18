import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { EntryFormValues, HealthCheckRating } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
}

const healthCheckRatingOptions = Object.values(HealthCheckRating)
  .filter((x) => typeof x === "string")
  .map((key) => ({
    label: key,
    value: HealthCheckRating[key as keyof typeof HealthCheckRating],
  }));

const AddHealthCheckEntryForm = ({ onSubmit }: Props): JSX.Element => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!date || !specialist || !description || !healthCheckRating) {
      return;
    }

    onSubmit({
      date,
      type: "HealthCheck",
      specialist,
      description,
      healthCheckRating: Number(healthCheckRating),
    });
  };

  return (
    <form onSubmit={addEntry}>
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
        <Typography component="label">health check rating</Typography>
        <Select
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(e.target.value)}
          fullWidth
          required
        >
          <MenuItem value=""></MenuItem>
          {healthCheckRatingOptions.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button variant="contained" type="submit">
        add
      </Button>
    </form>
  );
};

export default AddHealthCheckEntryForm;
