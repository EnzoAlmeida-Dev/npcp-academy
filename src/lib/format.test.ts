import { describe, expect, it } from "vitest";

import { formatDate } from "./format";

describe("formatDate", () => {
  it("formata como dd/mm/aaaa", () => {
    expect(formatDate("2026-11-03T15:00:00Z")).toBe("03/11/2026");
  });

  it("usa o fuso de Salvador (UTC-3), nao o do servidor", () => {
    expect(formatDate("2026-11-04T01:30:00Z")).toBe("03/11/2026");
  });

  it("aceita Date", () => {
    expect(formatDate(new Date("2026-01-15T12:00:00Z"))).toBe("15/01/2026");
  });
});
