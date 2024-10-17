import { CoursePart } from "../courseParts";

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  if (part.kind === "basic") {
    return (
      <p>
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
        </div>
        <div>
          <em>{part.description}</em>
        </div>
      </p>
    );
  }

  if (part.kind === "group") {
    return (
      <p>
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
        </div>
        <div>project exercises {part.groupProjectCount}</div>
      </p>
    );
  }

  if (part.kind === "background") {
    return (
      <p>
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
        </div>
        <div>
          <em>{part.description}</em>
        </div>
        <div>submit to {part.backgroundMaterial}</div>
      </p>
    );
  }

  if (part.kind === "special") {
    return (
      <p>
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
        </div>
        <div>
          <em>{part.description}</em>
        </div>
        <div>required skills: {part.requirements.join(", ")}</div>
      </p>
    );
  }

  return assertNever(part);
};

export default Part;
