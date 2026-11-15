import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import manifest from "./manifest";

describe("identidade visual", () => {
  it("todo icone do manifest existe em public/", () => {
    for (const icon of manifest().icons ?? []) {
      expect(existsSync(join(process.cwd(), "public", icon.src))).toBe(true);
    }
  });

  it.each([
    "public/brand/wordmark-dark.svg",
    "public/brand/wordmark-white.svg",
    "src/app/favicon.ico",
    "src/app/icon.svg",
    "src/app/apple-icon.png",
  ])("%s existe", (file) => {
    expect(existsSync(join(process.cwd(), file))).toBe(true);
  });
});
