import { CoursePart } from "../types";

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <>
      {parts.map((p) => (
        <p key={p.name}>
          {p.name} {p.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
