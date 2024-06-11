import Range, { RangeProps } from "@/components/Range";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Knob component", () => {
  const props: RangeProps = {
    max: 10000,
    min: 1,
  };
  it("does not move at all because the range bar length is zero :__(", async () => {
    const user = userEvent.setup();
    const range = render(<Range max={props.max} min={props.min} />);
    const button = screen.getByRole("button", {
      name: `range button max`,
    });
    const bar = await screen.findByTestId("range-bar");
    // bar width is always 0 --> impossible to test knobs behavior
    console.log(bar.getBoundingClientRect());

    const initialRect = button.getBoundingClientRect();
    fireEvent.mouseDown(button);
    fireEvent.mouseMove(document, {
      clientX: initialRect.left + 50,
    });
    fireEvent.mouseUp(document);

    const finalRect = button.getBoundingClientRect();
    expect(finalRect.left).toBe(initialRect.left);
  });
});
