import { CoursePart } from "../courseParts";
import Part from "./Part";

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <>
      {parts.map((p) => (
        <Part key={p.name} part={p} />
      ))}
    </>
  );
};

export default Content;
