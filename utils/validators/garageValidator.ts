import { z } from "zod";

export enum Salutation {
  Mr = "Mr.",
  Mrs = "Mrs.",
  Miss = "Miss.",
  Ms = "Ms.",
  Dr = "Dr.",
  Prof = "Prof.",
  Eng = "Eng.",
  Sir = "Sir.",
  Madam = "Madam",
  Mademoiselle = "Mademoiselle",
  SirMadam = "Sir/Madam",
}

const SalutationEnum = z.nativeEnum(Salutation);

export enum Gender {
  Male = "Male",
  Female = "Female",
}

const GenderEnum = z.nativeEnum(Gender);

const MAX_FILE_SIZE = 3145728;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageSchema = z
  .any()
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 3MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png formats are supported."
  );

const serviceSchema = z.object({
  name: z.string({ required_error: "The name of the service is required" }),
  description: z.string().optional(),
});

const contactPersonSchema = z.object({
  name: z.string({ required_error: "Contact person's name is required" }),
  email: z.string({ required_error: "Email is required" }).email(),
  phone: z.string({ required_error: "Contact's person's phone is required" }),
  gender: z.optional(z.union([z.literal(""), GenderEnum])),
  salutation: z
    .string({ required_error: "Salutation is required" })
    .refine((val) => val !== "", {
      message: "Salutation is required",
      path: ["salutation"],
    }),

  role: z.string({
    required_error: "The role of the contact person is required",
  }),
});

export const garageServiceSchema = z.object({
  service: z.string({ required_error: "service is required" }),
  price: z.number().optional(),
  currency: z.string().optional(),
  createdBy: z.string().optional(),
});

export const garageAddressSchema = z.object({
  name: z.string({ required_error: "The garage address is required" }),
  longitude: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
});

export const garageSchema = z.object({
  name: z.string({ required_error: "Garage name is required" }),
  phone: z.string({ required_error: "Phone number is required" }),
  createdAt: z.string().datetime().optional(),
  status: z.string().optional(),
  description: z.string({ required_error: "Description is required" }),
  garageAddress: garageAddressSchema,
  logoUrl: z.string({ required_error: "Logo is required" }),
  logo: z.optional(imageSchema),
  logoField: z.string().optional(),
  district: z.string({ required_error: "District is required" }),
  areas: z
    .array(z.string({ required_error: "name of the area is required" }))
    .min(1, { message: "At least one area is required" }),
  primaryCarTypes: z
    .array(z.string({ required_error: "Car type is required" }))
    .min(1, { message: "At least one car type is required" }),
  garageServices: z
    .array(garageServiceSchema)
    // .array(z.string({ required_error: "Service is required"}))
    .min(1, { message: "At least one service is required" }),
  contactPerson: contactPersonSchema,
});

export type GarageFormValues = z.infer<typeof garageSchema>;
export type GarageServiceFormValues = z.infer<typeof garageServiceSchema>;
// export type CarType = z.infer<typeof carTypeSchema>;
export type Service = z.infer<typeof serviceSchema>;
