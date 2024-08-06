import { z } from "zod";

export const userProfileSchema = z.object({
  firstName: z.string(),
  secondName: z.string(),
  salutation: z.string(),
  gender: z.string(),
  email: z.string(),
  // favoritePlaces: z.string(),
  workPlace: z.string(),
  home: z.string(),
  // hangout:,
  currentGarageName: z.string(),
  mechanicName: z.string(),
  mechanicPhoneNumber: z.string(),
  recommendMechanic: z.boolean(),
})