import { Female, Male, Transgender } from "@mui/icons-material";
import { Gender } from "../types";

const GenderIcon = ({ gender }: { gender: Gender }) => {
  if (gender === Gender.Male) {
    return <Male />;
  }
  if (gender === Gender.Female) {
    return <Female />;
  }
  if (gender === Gender.Other) {
    return <Transgender />;
  }

  const _exhaustiveCheck: never = gender;
  return _exhaustiveCheck;
};

export default GenderIcon;
