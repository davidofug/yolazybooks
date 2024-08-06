import { z } from 'zod';

const carTypeSchema = z.object({
  name: z.string().nonempty("Must not be empty"),
  logFile: z.string().nonempty("This field must not be empty"),
  logUrl: z.string().url("This field must be a url")
});

const serviceSchema = z.object({
  name: z.string().nonempty("Service must have a name"),
  description: z.string().nonempty("Description must not be empty"),
  thumbnailField: z.string().nonempty("Field must not be empty"),
  thumbnailUrl: z.string(),
  createdBy: z.date()
});

export const vehicleSchema = z.object({
  selectedCarType: z.string(),
  picture: z.any(),
  licensePlate: z.string(),
  chassisNumber: z.string(),
  currentMileage: z.number(),
  lastServiceDate: z.string(),
  lastServicesOffered: z.string(),
  lastServiceGarageName: z.string(),
  purchaseDate: z.string(),
  companyName: z.string()
});