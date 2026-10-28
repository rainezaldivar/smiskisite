import { z } from "zod";

export const newPasswordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use no more than 72 characters.")
  .refine(
    (value) => new TextEncoder().encode(value).length <= 72,
    "Your password is too long. Use no more than 72 bytes, including any emoji or accented characters.",
  );
