import { z } from "zod";

/** Mesmas regras de public.set_display_name (D28). */
export const DISPLAY_NAME_MIN = 2;
export const DISPLAY_NAME_MAX = 60;

export const displayNameSchema = z
  .string()
  .trim()
  .min(DISPLAY_NAME_MIN)
  .max(DISPLAY_NAME_MAX);
