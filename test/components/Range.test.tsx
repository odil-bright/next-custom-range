import Range, { RangeProps } from "@/components/Range";
import { render, screen } from "@testing-library/react";

describe("Range component", () => {
  const props: RangeProps = {
    max: 10000,
    min: 1,
  };
  it("renders correctly", async () => {
    const component = render(<Range max={props.max} min={props.min} />);
    expect(component).toBeDefined();
  });
  it("has two inpuLabel buttons", async () => {
    render(<Range max={props.max} min={props.min} />);
    const inputLabelButtons = screen.getAllByRole("button", {
      name: /label button/i,
    });
    expect(inputLabelButtons).toHaveLength(2);
  });
  it("has two knob buttons", async () => {
    render(<Range max={props.max} min={props.min} />);
    const knobButtons = screen.getAllByRole("button", {
      name: /range button/i,
    });
    expect(knobButtons).toHaveLength(2);
  });
});
