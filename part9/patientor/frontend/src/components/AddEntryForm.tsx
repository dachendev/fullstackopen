import { Alert, Box, Button, Input, Typography } from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { EntryFormValues } from "../types";

interface Props {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  error: string;
}

const AddEntryForm = ({ onSubmit, error }: Props): JSX.Element => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");

  const onHealthCheckRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value && !isNaN(Number(event.target.value))) {
      const value = event.target.value;
      setHealthCheckRating(value);
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      type: "HealthCheck",
      specialist,
      description,
      healthCheckRating: Number(healthCheckRating),
    });
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed grey" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={addEntry}>
        <Box sx={{ mb: 2 }}>
          <Typography component="label">description</Typography>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography component="label">date</Typography>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography component="label">specialist</Typography>
          <Input
            type="text"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography component="label">health check rating</Typography>
          <Input
            type="number"
            value={healthCheckRating}
            onChange={onHealthCheckRatingChange}
            fullWidth
          />
        </Box>
        <Button variant="contained" type="submit">
          add
        </Button>
      </form>
    </Box>
  );
};

export default AddEntryForm;
