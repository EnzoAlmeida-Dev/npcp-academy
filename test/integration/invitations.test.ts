import { createHash, randomBytes } from "node:crypto";

import { afterAll, describe, expect, it } from "vitest";

import { createUser, deleteCreatedUsers, profileOf } from "./helpers";

afterAll(deleteCreatedUsers);

const hash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const inDays = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

async function createInvitation(options: {
  email: string;
  role?: "member" | "reviewer" | "manager";
  membership?: "trainee" | "efetivado";
  expired?: boolean;
}) {
  const manager = await createUser("manager");
  const token = randomBytes(32).toString("base64url");
  const { error } = await manager.client.from("invitations").insert({
    email_normalized: options.email,
    token_hash: hash(token),
    role: options.role ?? "member",
    membership: options.membership ?? "trainee",
    created_by: manager.id,
    ...(options.expired
      ? { created_at: inDays(-2), expires_at: inDays(-1) }
      : { expires_at: inDays(7) }),
  });
  if (error) {
    throw new Error(`convite: ${error.message}`);
  }
  return token;
}

describe("convites (RLS)", () => {
  it("membro nao cria nem lista convites", async () => {
    const member = await createUser("member");
    const insert = await member.client.from("invitations").insert({
      email_normalized: "x@npcp.test",
      token_hash: hash("qualquer"),
      created_by: member.id,
      expires_at: inDays(7),
    });
    expect(insert.error).not.toBeNull();

    const { data } = await member.client.from("invitations").select("id");
    expect(data).toHaveLength(0);
  });

  it("gerente nao cria convite em nome de outra pessoa", async () => {
    const manager = await createUser("manager");
    const other = await createUser("manager");
    const { error } = await manager.client.from("invitations").insert({
      email_normalized: "y@npcp.test",
      token_hash: hash(randomBytes(8).toString("hex")),
      created_by: other.id,
      expires_at: inDays(7),
    });
    expect(error).not.toBeNull();
  });
});

describe("consume_invitation", () => {
  it.each(["trainee", "efetivado"] as const)(
    "aplica o vinculo %s definido no convite (D44)",
    async (membership) => {
      const invited = await createUser("member", { activate: false });
      const token = await createInvitation({ email: invited.email, membership });
      const { error } = await invited.client.rpc("consume_invitation", {
        p_token_hash: hash(token),
        p_user_id: invited.id,
      });
      expect(error).toBeNull();
      expect((await profileOf(invited.id))?.membership).toBe(membership);
    },
  );

  it("convite valido ativa a conta com o papel do convite uma unica vez", async () => {
    const invited = await createUser("member", { activate: false });
    const token = await createInvitation({ email: invited.email, role: "reviewer" });

    const first = await invited.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: invited.id,
    });
    expect(first.error).toBeNull();
    const profile = await profileOf(invited.id);
    expect(profile?.role).toBe("reviewer");
    expect(profile?.activated_at).not.toBeNull();

    // Repetir com o mesmo usuario e idempotente.
    const again = await invited.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: invited.id,
    });
    expect(again.error).toBeNull();
  });

  it("convite usado nao ativa outra conta", async () => {
    const first = await createUser("member", { activate: false });
    const token = await createInvitation({ email: first.email });
    await first.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: first.id,
    });

    const second = await createUser("member", { activate: false });
    const { error } = await second.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: second.id,
    });
    expect(error?.message).toContain("invalid_invitation");
    expect((await profileOf(second.id))?.activated_at).toBeNull();
  });

  it("convite para outro e-mail nao ativa a conta", async () => {
    const user = await createUser("member", { activate: false });
    const token = await createInvitation({ email: "outra-pessoa@npcp.test" });
    const { error } = await user.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: user.id,
    });
    expect(error?.message).toContain("invalid_invitation");
  });

  it("convite expirado nao ativa a conta", async () => {
    const user = await createUser("member", { activate: false });
    const token = await createInvitation({ email: user.email, expired: true });
    const { error } = await user.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: user.id,
    });
    expect(error?.message).toContain("invalid_invitation");
  });

  it("nao consome em nome de outro usuario", async () => {
    const victim = await createUser("member", { activate: false });
    const attacker = await createUser("member", { activate: false });
    const token = await createInvitation({ email: victim.email });
    const { error } = await attacker.client.rpc("consume_invitation", {
      p_token_hash: hash(token),
      p_user_id: victim.id,
    });
    expect(error?.message).toContain("invalid_invitation");
  });
});
