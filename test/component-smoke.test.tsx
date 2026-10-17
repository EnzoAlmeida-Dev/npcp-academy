import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("setup de testes de componente", () => {
  it("renderiza React no jsdom com matchers do jest-dom", () => {
    render(<p>ok</p>);

    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
