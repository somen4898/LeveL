import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RewardWindowStrip } from "@/components/today/reward-window-strip";

describe("RewardWindowStrip", () => {
  it("renders all 18 cells", () => {
    const cells: ("q" | "m" | "t" | "f")[] = Array(18).fill("f");
    const { container } = render(
      <RewardWindowStrip cells={cells} label="Test window" sub="0 of 18" />
    );
    const grid = container.querySelector(".grid");
    expect(grid?.children.length).toBe(18);
  });

  it("renders qualified cells with checkmark", () => {
    const cells: ("q" | "m" | "t" | "f")[] = ["q", ...Array(17).fill("f")];
    render(<RewardWindowStrip cells={cells} label="Test" sub="1 of 18" />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders missed cells with x", () => {
    const cells: ("q" | "m" | "t" | "f")[] = ["m", ...Array(17).fill("f")];
    render(<RewardWindowStrip cells={cells} label="Test" sub="0 of 18" />);
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("renders current day marker", () => {
    const cells: ("q" | "m" | "t" | "f")[] = ["t", ...Array(17).fill("f")];
    render(<RewardWindowStrip cells={cells} label="Test" sub="0 of 18" />);
    expect(screen.getByText("NOW")).toBeInTheDocument();
  });

  it("renders label and sub text", () => {
    const cells: ("q" | "m" | "t" | "f")[] = Array(18).fill("f");
    render(<RewardWindowStrip cells={cells} label="Reward window · 1 → 18" sub="5 of 18 days" />);
    expect(screen.getByText("Reward window · 1 → 18")).toBeInTheDocument();
    expect(screen.getByText("5 of 18 days")).toBeInTheDocument();
  });
});
