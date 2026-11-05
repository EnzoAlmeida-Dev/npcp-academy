import { describe, expect, it } from "vitest";

import { countOpenInvitations, summarizeUsers } from "./summary";

const now = Date.parse("2026-11-05T12:00:00Z");
const active = { activated_at: "2026-10-01T00:00:00Z", disabled_at: null };

describe("summarizeUsers", () => {
  it("separa ativos, pendentes e desativados", () => {
    const summary = summarizeUsers([
      { role: "member", ...active },
      { role: "manager", ...active },
      { role: "member", activated_at: null, disabled_at: null },
      {
        role: "reviewer",
        activated_at: "2026-10-01T00:00:00Z",
        disabled_at: "2026-10-02T00:00:00Z",
      },
    ]);
    expect(summary).toMatchObject({
      active: 2,
      pendingActivation: 1,
      disabled: 1,
    });
  });

  it("conta papeis so entre contas ativas", () => {
    const { activeByRole } = summarizeUsers([
      { role: "reviewer", ...active },
      {
        role: "reviewer",
        activated_at: "2026-10-01T00:00:00Z",
        disabled_at: "2026-10-02T00:00:00Z",
      },
      { role: "manager", activated_at: null, disabled_at: null },
    ]);
    expect(activeByRole).toEqual({ member: 0, reviewer: 1, manager: 0 });
  });
});

describe("countOpenInvitations", () => {
  const open = {
    used_at: null,
    revoked_at: null,
    expires_at: "2026-11-10T00:00:00Z",
  };

  it("exclui usados, revogados e expirados", () => {
    expect(
      countOpenInvitations(
        [
          open,
          { ...open, used_at: "2026-11-01T00:00:00Z" },
          { ...open, revoked_at: "2026-11-01T00:00:00Z" },
          { ...open, expires_at: "2026-11-01T00:00:00Z" },
        ],
        now,
      ),
    ).toBe(1);
  });
});
