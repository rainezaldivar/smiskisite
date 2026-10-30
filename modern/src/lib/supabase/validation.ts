import { z } from "zod";
import { getNewPasswordError } from "./password-rules.mjs";

export const newPasswordSchema = z.string().superRefine((value, context) => {
  const message = getNewPasswordError(value);
  if (message) context.addIssue({ code: "custom", message });
});
