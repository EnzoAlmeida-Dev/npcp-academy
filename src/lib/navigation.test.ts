import { describe, expect, it } from "vitest";

import { getNavItemsForRole, NAV_ITEMS } from "./navigation";

describe("navegacao por papel", () => {
  it("member ve apenas itens de member", () => {
    const keys = getNavItemsForRole("member").map((i) => i.key);
    expect(keys).toContain("dashboard");
    expect(keys).toContain("paths");
    expect(keys).toContain("competencies");
    expect(keys).not.toContain("reviews");
    expect(keys).not.toContain("invitations");
    expect(keys).not.toContain("users");
  });

  it("reviewer ve itens de reviewer e member, mas nao de manager", () => {
    const keys = getNavItemsForRole("reviewer").map((i) => i.key);
    expect(keys).toContain("dashboard");
    expect(keys).toContain("reviews");
    expect(keys).not.toContain("invitations");
    expect(keys).not.toContain("users");
  });

  it("manager ve todos os itens", () => {
    const keys = getNavItemsForRole("manager").map((i) => i.key);
    for (const item of NAV_ITEMS) {
      expect(keys).toContain(item.key);
    }
  });
});
