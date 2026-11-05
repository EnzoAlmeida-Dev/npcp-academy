import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressChevrons } from "./progress-chevrons";

describe("ProgressChevrons", () => {
  it("expoe valor e total para tecnologia assistiva", () => {
    render(<ProgressChevrons value={2} total={3} label="Primeiros passos" />);
    const bar = screen.getByRole("progressbar", { name: "Primeiros passos" });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "3");
    expect(bar.querySelectorAll('[data-filled="true"]')).toHaveLength(2);
    expect(bar.children).toHaveLength(3);
  });

  it.each([
    [-1, 0],
    [9, 3],
  ])("limita o valor %i a %i", (value, expected) => {
    render(<ProgressChevrons value={value} total={3} label="Etapas" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      String(expected),
    );
  });
});
