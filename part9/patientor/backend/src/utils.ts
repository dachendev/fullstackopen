import { z } from "zod";
import { Gender, HealthCheckRating } from "./types";

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const NewEntryBaseSchema = z.object({
  date: z.string().date(),
  description: z.string(),
  specialist: z.string(),
  type: z.string(),
});

const NewHealthCheckEntrySchema = NewEntryBaseSchema.extend({
  healthCheckRating: z.nativeEnum(HealthCheckRating),
  type: z.literal("HealthCheck"),
});

const NewOccupationalHealthcareEntrySchema = NewEntryBaseSchema.extend({
  employerName: z.string(),
  diagnosisCodes: z.string().array().optional(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
  type: z.literal("OccupationalHealthcare"),
});

const NewHospitalEntrySchema = NewEntryBaseSchema.extend({
  diagnosisCodes: z.string().array(),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
  type: z.literal("Hospital"),
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  NewHealthCheckEntrySchema,
  NewOccupationalHealthcareEntrySchema,
  NewHospitalEntrySchema,
]);
