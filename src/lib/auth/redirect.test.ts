import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("aceita destinos da lista", () => {
    expect(safeNextPath("/reset-password")).toBe("/reset-password");
  });

  it.each([
    null,
    "",
    "https://malicioso.example",
    "//malicioso.example",
    "/reset-password/../admin",
    "/admin/users",
  ])("rejeita %j", (value) => {
    expect(safeNextPath(value)).toBeNull();
  });
});
