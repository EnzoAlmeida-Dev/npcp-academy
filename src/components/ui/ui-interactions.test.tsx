import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmDialog } from "./confirm-dialog";
import { CopyButton } from "./copy-button";
import { PasswordInput } from "./password-input";

function Harness({ onConfirm }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir
      </button>
      <ConfirmDialog
        open={open}
        title="Revogar convite?"
        description="Não pode ser desfeito."
        onClose={() => setOpen(false)}
      >
        <button type="button" onClick={onConfirm}>
          Confirmar
        </button>
      </ConfirmDialog>
    </>
  );
}

describe("ConfirmDialog", () => {
  it("nao renderiza fechado e expoe papel dialog com titulo quando aberto", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    const dialog = screen.getByRole("dialog", { name: "Revogar convite?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Não pode ser desfeito.");
  });

  it("foca em Cancelar ao abrir", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus();
  });

  it("fecha com Esc e devolve o foco ao botao que abriu", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Abrir" });
    await user.click(opener);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(opener).toHaveFocus();
  });

  it("fecha ao cancelar e nao dispara a confirmacao", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("mantem o foco dentro do dialogo ao tabular", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.tab();
    expect(screen.getByRole("button", { name: "Confirmar" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Confirmar" })).toHaveFocus();
  });
});

describe("PasswordInput", () => {
  it("alterna entre ocultar e mostrar a senha", async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Senha" />);
    const input = screen.getByLabelText("Senha");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(input).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
    expect(input).toHaveAttribute("type", "password");
  });
});

describe("CopyButton", () => {
  it("copia o valor e anuncia o resultado", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<CopyButton value="https://exemplo.test/invite/abc" />);
    await user.click(screen.getByRole("button", { name: "Copiar link" }));

    expect(writeText).toHaveBeenCalledWith("https://exemplo.test/invite/abc");
    expect(await screen.findByText("Link copiado.")).toBeInTheDocument();
  });

  it("informa falha quando a area de transferencia nao esta disponivel", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("negado")) },
      configurable: true,
    });

    render(<CopyButton value="x" />);
    await user.click(screen.getByRole("button", { name: "Copiar link" }));

    expect(
      (await screen.findAllByText(/Não foi possível copiar/)).length,
    ).toBeGreaterThan(0);
  });
});
