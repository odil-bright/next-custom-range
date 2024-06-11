import Range, { RangeProps } from "@/components/Range";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("InputLabel component", () => {
  const props: RangeProps = {
    max: 10000,
    min: 1,
  };
  it("renders correctly", () => {
    const component = render(<Range max={props.max} min={props.min} />);
    expect(component).toBeDefined();
  });
  it.each(["min", "max"])(
    "allows users to click on both currency number values and set a new value",
    async (key) => {
      const user = userEvent.setup();
      render(<Range max={props.max} min={props.min} />);
      const button = screen.getByRole("button", {
        name: `label button ${key}`,
      });
      expect(button).toBeDefined();
      await user.click(button);
      const input = await screen.findByRole("spinbutton");
      expect(input).toBeDefined();
      await user.clear(input);
      await user.type(input, "2000[Enter]");
      expect(await screen.findByText("2000€")).toBeDefined();
    }
  );
  it.each(["0", "20000"])(
    "does not allow user to set a min value greater than max value nor lesser than min range",
    async (key) => {
      const user = userEvent.setup();
      render(<Range max={props.max} min={props.min} />);
      const button = screen.getByRole("button", {
        name: `label button min`,
      });
      expect(button).toBeDefined();
      await user.click(button);
      const input = await screen.findByRole("spinbutton");
      expect(input).toBeDefined();
      await user.clear(input);
      await user.type(input, `${key}[Enter]`);
      expect(screen.queryByText("2000€")).toBeNull();
    }
  );
});
