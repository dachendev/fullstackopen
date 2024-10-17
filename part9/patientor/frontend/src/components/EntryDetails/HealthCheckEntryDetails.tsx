import { Search } from "@mui/icons-material";
import { HealthCheckEntry } from "../../types";
import HealthRatingBar from "../HealthRatingBar";

interface Props {
  entry: HealthCheckEntry;
}

const HealthCheckEntryDetails = ({ entry }: Props) => {
  return (
    <>
      <div>
        {entry.date} <Search />
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      <div>
        <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      </div>
      <div>diagnose by {entry.specialist}</div>
    </>
  );
};

export default HealthCheckEntryDetails;
