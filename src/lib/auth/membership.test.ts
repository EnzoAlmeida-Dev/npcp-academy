import { describe, expect, it } from "vitest";

import { defaultMembershipForRole, MEMBERSHIP_LABELS } from "./membership";

describe("vinculo", () => {
  it("sugere trainee para membro e efetivado para os demais papeis", () => {
    expect(defaultMembershipForRole("member")).toBe("trainee");
    expect(defaultMembershipForRole("reviewer")).toBe("efetivado");
    expect(defaultMembershipForRole("manager")).toBe("efetivado");
  });

  it("tem rotulo para cada vinculo", () => {
    expect(MEMBERSHIP_LABELS).toEqual({ trainee: "Trainee", efetivado: "Efetivado" });
  });
});
