import { z } from "zod";

/** Minimo para senhas novas ou redefinidas (D36). Login aceita senhas antigas. */
export const PASSWORD_MIN_LENGTH = 8;

export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH)
  .max(72); // limite do bcrypt usado pelo Supabase Auth
