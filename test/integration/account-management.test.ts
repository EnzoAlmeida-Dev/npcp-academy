import { afterAll, describe, expect, it } from "vitest";

import {
  admin,
  createUser,
  deleteCreatedUsers,
  profileOf,
  signIn,
} from "./helpers";

afterAll(deleteCreatedUsers);

describe("change_user_role", () => {
  it("membro e responsavel tecnico nao alteram papeis", async () => {
    const target = await createUser("member");
    for (const role of ["member", "reviewer"] as const) {
      const actor = await createUser(role);
      const { error } = await actor.client.rpc("change_user_role", {
        p_user_id: target.id,
        p_role: "manager",
      });
      expect(error?.message).toContain("not_authorized");
    }
    expect((await profileOf(target.id))?.role).toBe("member");
  });

  it("gerente nao altera o proprio papel", async () => {
    const manager = await createUser("manager");
    const { error } = await manager.client.rpc("change_user_role", {
      p_user_id: manager.id,
      p_role: "member",
    });
    expect(error?.message).toContain("cannot_change_own_role");
    expect((await profileOf(manager.id))?.role).toBe("manager");
  });

  it("gerente promove membro e o evento fica registrado com o autor", async () => {
    const manager = await createUser("manager");
    const member = await createUser("member");

    const { data, error } = await manager.client.rpc("change_user_role", {
      p_user_id: member.id,
      p_role: "reviewer",
    });
    expect(error).toBeNull();
    expect(data).toBe("reviewer");
    expect((await profileOf(member.id))?.role).toBe("reviewer");

    const { data: events } = await manager.client
      .from("account_events")
      .select("*")
      .eq("user_id", member.id);
    expect(events).toHaveLength(1);
    expect(events?.[0]).toMatchObject({
      event_type: "role_changed",
      old_value: "member",
      new_value: "reviewer",
      actor_id: manager.id,
    });
  });

  it("nao altera papel de conta ainda nao ativada", async () => {
    const manager = await createUser("manager");
    const pending = await createUser("member", { activate: false });
    const { error } = await manager.client.rpc("change_user_role", {
      p_user_id: pending.id,
      p_role: "reviewer",
    });
    expect(error?.message).toContain("user_not_activated");
  });

  it("dois gerentes rebaixando um ao outro ao mesmo tempo: so um consegue", async () => {
    const a = await createUser("manager");
    const b = await createUser("manager");

    const results = await Promise.all([
      a.client.rpc("change_user_role", { p_user_id: b.id, p_role: "member" }),
      b.client.rpc("change_user_role", { p_user_id: a.id, p_role: "member" }),
    ]);

    const succeeded = results.filter((r) => r.error === null);
    expect(succeeded).toHaveLength(1);
    expect(results.find((r) => r.error)?.error?.message).toContain(
      "not_authorized",
    );

    const roles = [(await profileOf(a.id))?.role, (await profileOf(b.id))?.role];
    expect(roles.sort()).toEqual(["manager", "member"]);
  });
});

describe("set_user_disabled", () => {
  it("conta desativada perde acesso mesmo com sessao valida e volta ao reativar", async () => {
    const manager = await createUser("manager");
    const member = await createUser("member");

    const before = await member.client.from("profiles").select("id");
    expect(before.data).toHaveLength(1);

    const { error } = await manager.client.rpc("set_user_disabled", {
      p_user_id: member.id,
      p_disabled: true,
    });
    expect(error).toBeNull();

    // Mesmo token de sessao: RLS passa a negar.
    const during = await member.client.from("profiles").select("id");
    expect(during.data).toHaveLength(0);
    const status = await member.client.rpc("get_my_account_status");
    expect(status.data?.[0]).toEqual({ activated: true, disabled: true });
    const rename = await member.client.rpc("set_display_name", {
      p_display_name: "Novo Nome",
    });
    expect(rename.error?.message).toContain("not_authorized");

    await manager.client.rpc("set_user_disabled", {
      p_user_id: member.id,
      p_disabled: false,
    });
    const after = await member.client.from("profiles").select("id");
    expect(after.data).toHaveLength(1);

    const { data: events } = await manager.client
      .from("account_events")
      .select("event_type, actor_id")
      .eq("user_id", member.id)
      .order("created_at");
    expect(events).toEqual([
      { event_type: "disabled", actor_id: manager.id },
      { event_type: "reactivated", actor_id: manager.id },
    ]);
  });

  it("gerente nao desativa a propria conta", async () => {
    const manager = await createUser("manager");
    const { error } = await manager.client.rpc("set_user_disabled", {
      p_user_id: manager.id,
      p_disabled: true,
    });
    expect(error?.message).toContain("cannot_change_own_status");
  });

  it("membro nao desativa outras contas", async () => {
    const member = await createUser("member");
    const other = await createUser("member");
    const { error } = await member.client.rpc("set_user_disabled", {
      p_user_id: other.id,
      p_disabled: true,
    });
    expect(error?.message).toContain("not_authorized");
    expect((await profileOf(other.id))?.disabled_at).toBeNull();
  });
});

describe("account_events", () => {
  it("membro nao le o historico de contas", async () => {
    const manager = await createUser("manager");
    const member = await createUser("member");
    await manager.client.rpc("change_user_role", {
      p_user_id: member.id,
      p_role: "reviewer",
    });
    const reviewer = await signIn(member.email);
    const { data } = await reviewer.from("account_events").select("*");
    expect(data).toHaveLength(0);
  });

  it("cliente nao escreve no historico diretamente", async () => {
    const manager = await createUser("manager");
    const { error } = await manager.client.from("account_events").insert({
      user_id: manager.id,
      event_type: "role_changed",
    });
    expect(error).not.toBeNull();
  });
});

describe("set_display_name e perfil", () => {
  it("define o proprio nome sem espacos nas pontas", async () => {
    const member = await createUser("member", { displayName: null });
    const { data, error } = await member.client.rpc("set_display_name", {
      p_display_name: "  Ana Souza  ",
    });
    expect(error).toBeNull();
    expect(data).toBe("Ana Souza");
    expect((await profileOf(member.id))?.display_name).toBe("Ana Souza");
  });

  it.each(["A", " ", "x".repeat(61)])("rejeita nome invalido %j", async (name) => {
    const member = await createUser("member");
    const { error } = await member.client.rpc("set_display_name", {
      p_display_name: name,
    });
    expect(error?.message).toContain("invalid_display_name");
  });

  it("conta nao ativada nao define nome", async () => {
    const pending = await createUser("member", { activate: false });
    const { error } = await pending.client.rpc("set_display_name", {
      p_display_name: "Fulano",
    });
    expect(error?.message).toContain("not_authorized");
  });

  it("cliente nao altera o proprio papel nem status pela tabela", async () => {
    const member = await createUser("member");
    await member.client
      .from("profiles")
      .update({ role: "manager", disabled_at: null })
      .eq("id", member.id);
    expect((await profileOf(member.id))?.role).toBe("member");
  });

  it("usuario nao le o perfil de outra pessoa", async () => {
    const member = await createUser("member");
    const other = await createUser("member");
    const { data } = await member.client
      .from("profiles")
      .select("id")
      .eq("id", other.id);
    expect(data).toHaveLength(0);
    // Sanidade: o perfil existe.
    expect(await profileOf(other.id)).not.toBeNull();
    expect(admin).toBeDefined();
  });
});
