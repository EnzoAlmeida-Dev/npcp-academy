/** Destinos permitidos apos /auth/confirm. Evita redirecionamento aberto. */
const ALLOWED_NEXT_PATHS = ["/reset-password"] as const;

export type ConfirmNextPath = (typeof ALLOWED_NEXT_PATHS)[number];

export function safeNextPath(value: string | null): ConfirmNextPath | null {
  return (ALLOWED_NEXT_PATHS as readonly string[]).includes(value ?? "")
    ? (value as ConfirmNextPath)
    : null;
}
