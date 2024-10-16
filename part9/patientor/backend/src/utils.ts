import { Gender, NewPatient } from "./types";

export const isString = (s: unknown): s is string => {
  return typeof s === "string";
};

export const isObject = (o: unknown): o is object => {
  return typeof o === "object" && o !== null;
};

export const isGender = (s: string): s is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(s);
};

export const parseString = (s: unknown): string => {
  if (!isString(s)) {
    throw new Error("Expected a string");
  }
  return s;
};

export const parseGender = (s: unknown): Gender => {
  if (!isString(s) || !isGender(s)) {
    throw new Error("Invalid or missing gender");
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
      name: parseString(o.name),
      dateOfBirth: parseString(o.dateOfBirth),
      ssn: parseString(o.ssn),
      gender: parseGender(o.gender),
      occupation: parseString(o.occupation),
    };

    return newPatient;
  }

  throw new Error("Missing required fields");
};
