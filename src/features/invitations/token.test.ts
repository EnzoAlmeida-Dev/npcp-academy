import { describe, expect, it } from "vitest";

import { generateInviteToken, hashToken, normalizeEmail } from "./token";

describe("token de convite", () => {
  it("gera tokens com entropia suficiente", () => {
    expect(generateInviteToken().length).toBeGreaterThanOrEqual(32);
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });

  it("hash e deterministico e hexadecimal de 64 caracteres", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("entradas distintas produzem hashes distintos", () => {
    expect(hashToken("a")).not.toBe(hashToken("b"));
  });
});

describe("normalizeEmail", () => {
  it("remove espacos e converte para minusculas", () => {
    expect(normalizeEmail("  Foo@Example.COM ")).toBe("foo@example.com");
  });
});
