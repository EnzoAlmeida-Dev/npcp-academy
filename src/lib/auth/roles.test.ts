import { describe, expect, it } from "vitest";

import { hasRoleAtLeast, ROLE_RANK } from "./roles";

describe("hierarquia de papeis", () => {
  it("member nao herda reviewer nem manager", () => {
    expect(hasRoleAtLeast("member", "member")).toBe(true);
    expect(hasRoleAtLeast("member", "reviewer")).toBe(false);
    expect(hasRoleAtLeast("member", "manager")).toBe(false);
  });

  it("reviewer herda member, mas nao manager", () => {
    expect(hasRoleAtLeast("reviewer", "member")).toBe(true);
    expect(hasRoleAtLeast("reviewer", "reviewer")).toBe(true);
    expect(hasRoleAtLeast("reviewer", "manager")).toBe(false);
  });

  it("manager herda reviewer e member", () => {
    expect(hasRoleAtLeast("manager", "member")).toBe(true);
    expect(hasRoleAtLeast("manager", "reviewer")).toBe(true);
    expect(hasRoleAtLeast("manager", "manager")).toBe(true);
  });

  it("rank e estritamente crescente", () => {
    expect(ROLE_RANK.member).toBeLessThan(ROLE_RANK.reviewer);
    expect(ROLE_RANK.reviewer).toBeLessThan(ROLE_RANK.manager);
  });
});
