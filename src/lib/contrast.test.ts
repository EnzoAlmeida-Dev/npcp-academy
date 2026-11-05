import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf-8",
);

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) {
    throw new Error(`token --color-${name} nao encontrado`);
  }
  return match[1];
}

type Rgb = [number, number, number];

function toRgb(hex: string): Rgb {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("contraste dos tokens (WCAG AA)", () => {
  const surface = token("surface");
  const canvas = token("canvas");
  const sheet = token("sheet");
  const ink = token("ink");
  const muted = token("muted");
  const secondary = token("secondary");
  const primary = token("primary");

  it.each([
    ["texto principal sobre moldura", ink, canvas],
    ["texto principal sobre folha", ink, sheet],
    ["texto secundario sobre moldura", muted, canvas],
    ["texto secundario sobre folha", muted, sheet],
    ["texto secundario sobre superficie", muted, surface],
    ["texto branco sobre botao primario", "#ffffff", primary],
    ["texto branco sobre hover do primario", "#ffffff", token("primary-hover")],
    ["links sobre superficie", secondary, surface],
    ["texto branco sobre painel grafite", "#ffffff", ink],
    ["texto secundario sobre painel grafite", token("on-ink-muted"), ink],
    ["erro sobre superficie", token("danger"), surface],
    ["sucesso sobre superficie", token("success"), surface],
    ["alerta sobre superficie", token("warning"), surface],
    ["informativo sobre superficie", token("info"), surface],
  ])("%s tem contraste >= 4.5:1", (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["borda de campo sobre superficie", token("field-border"), surface],
    ["borda de campo sobre folha", token("field-border"), sheet],
    ["foco sobre superficie", secondary, surface],
    ["foco sobre folha", secondary, sheet],
    ["foco sobre moldura", secondary, canvas],
    ["progresso preenchido sobre trilho", secondary, token("track")],
    ["papel membro sobre superficie", token("role-member"), surface],
    ["papel responsavel sobre superficie", token("role-reviewer"), surface],
    ["papel gerencia sobre superficie", token("role-manager"), surface],
  ])("%s tem contraste >= 3:1", (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });

  it("escala de papeis escurece com a hierarquia", () => {
    const steps = ["role-member", "role-reviewer", "role-manager"].map((t) =>
      luminance(token(t)),
    );
    expect(steps[0]).toBeGreaterThan(steps[1]);
    expect(steps[1]).toBeGreaterThan(steps[2]);
  });
});
