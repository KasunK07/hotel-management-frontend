import { z } from "zod";

export const businessRegistrationSchema = z.object({
  businessName: z.string().min(3, "Enter the registered business name"),
  registrationNumber: z.string().min(3, "Enter a valid registration number"),
  businessEmail: z.email("Enter a valid business email"),
  businessPhone: z.string().min(9, "Enter a valid business phone"),
  address: z.string().min(8, "Enter the full registered address"),
  city: z.string().min(2, "Enter a city"),
  postalCode: z.string().min(3, "Enter a postal code"),
  ownerName: z.string().min(3, "Enter the owner’s full name"),
  ownerEmail: z.union([z.literal(""), z.email("Enter a valid owner email")]),
  ownerPhone: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 9,
      "Enter a valid owner phone",
    ),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});
export type BusinessRegistrationValues = z.infer<
  typeof businessRegistrationSchema
>;

export const passwordSetupSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PasswordSetupValues = z.infer<typeof passwordSetupSchema>;
