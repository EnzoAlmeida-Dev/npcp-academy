import { describe, expect, it } from "vitest";

import { newPasswordSchema, PASSWORD_MIN_LENGTH } from "@/lib/auth/password";

import { displayNameSchema } from "./display-name";
import { accountErrorMessage } from "./errors";

describe("displayNameSchema", () => {
  it("remove espacos das pontas", () => {
    expect(displayNameSchema.parse("  Ana Souza  ")).toBe("Ana Souza");
  });

  it.each(["", " ", "A", "x".repeat(61)])("rejeita %j", (value) => {
    expect(displayNameSchema.safeParse(value).success).toBe(false);
  });

  it("aceita os limites de 2 e 60 caracteres", () => {
    expect(displayNameSchema.safeParse("Al").success).toBe(true);
    expect(displayNameSchema.safeParse("x".repeat(60)).success).toBe(true);
  });
});

describe("newPasswordSchema", () => {
  it("exige o minimo de caracteres", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8);
    expect(newPasswordSchema.safeParse("1234567").success).toBe(false);
    expect(newPasswordSchema.safeParse("12345678").success).toBe(true);
  });
});

describe("accountErrorMessage", () => {
  it("traduz codigos conhecidos", () => {
    expect(accountErrorMessage("last_manager")).toMatch(/sem gerente ativo/);
    expect(accountErrorMessage("cannot_change_own_role")).toMatch(
      /próprio papel/,
    );
    expect(accountErrorMessage("cannot_change_own_membership")).toMatch(
      /próprio vínculo/,
    );
  });

  it("nao vaza mensagens desconhecidas", () => {
    expect(accountErrorMessage("relation xyz does not exist")).toBe(
      "Não foi possível concluir a ação.",
    );
    expect(accountErrorMessage(undefined)).toBe(
      "Não foi possível concluir a ação.",
    );
  });
});
