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

/** Cor `fg` com opacidade `alpha` composta sobre `bg`. */
function blend(fg: string, bg: string, alpha: number): string {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return (
    "#" +
    f
      .map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
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
  const secondary = token("secondary");
  const primary = token("primary");

  it.each([
    ["texto principal sobre canvas", token("ink"), canvas],
    ["texto secundario sobre canvas", token("muted"), canvas],
    ["texto secundario sobre superficie", token("muted"), surface],
    ["texto branco sobre botao primario", "#ffffff", primary],
    ["texto branco sobre hover do primario", "#ffffff", token("primary-hover")],
    ["titulos sobre superficie", secondary, surface],
    ["nav ativa (branco sobre primario)", "#ffffff", primary],
    ["nav inativa (branco 80% sobre secundario)", blend("#ffffff", secondary, 0.8), secondary],
    ["'Em breve' (branco 70% sobre secundario)", blend("#ffffff", secondary, 0.7), secondary],
  ])("%s tem contraste >= 4.5:1", (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(["success", "danger", "warning", "info"])(
    "badge %s tem contraste >= 4.5:1",
    (tone) => {
      const color = token(tone);
      expect(ratio(color, blend(color, surface, 0.1))).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it.each([
    ["borda de campo sobre superficie", token("field-border"), surface],
    ["borda de campo sobre canvas", token("field-border"), canvas],
    ["foco primario sobre superficie", primary, surface],
    ["foco primario sobre canvas", primary, canvas],
    ["foco branco sobre secundario", "#ffffff", secondary],
    ["foco branco sobre primario (item ativo)", "#ffffff", primary],
  ])("%s tem contraste >= 3:1", (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });
});
