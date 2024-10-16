import { NewPatient } from "./types";

export const isString = (s: unknown): s is string => {
  return typeof s === "string";
};

export const isObject = (o: unknown): o is object => {
  return typeof o === "object" && o !== null;
};

export const ensureString = (s: unknown): string => {
  if (!isString(s)) {
    throw new Error("Expected a string");
  }
  return s;
};

export const toNewPatient = (o: unknown): NewPatient => {
  if (!isObject(o)) {
    throw new Error("Expected an object");
  }

  if (
    "name" in o &&
    "dateOfBirth" in o &&
    "ssn" in o &&
    "gender" in o &&
    "occupation" in o
  ) {
    const newPatient: NewPatient = {
      name: ensureString(o.name),
      dateOfBirth: ensureString(o.dateOfBirth),
      ssn: ensureString(o.ssn),
      gender: ensureString(o.gender),
      occupation: ensureString(o.occupation),
    };

    return newPatient;
  }

  throw new Error("Missing required fields");
};
