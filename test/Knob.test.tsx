import Range, { RangeProps } from "@/components/Range";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@/assets/App.scss";

vi.mock("lodash", () => ({
  debounce: vi.fn((fn) => {
    fn.cancel = vi.fn();
    fn.flush = vi.fn();
    return fn;
  }),
}));

const props: RangeProps = {
  max: 10000,
  min: 1,
  steps: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
};

describe("Knob component", () => {
  beforeEach(cleanup);
  it("on linear mode, it allows user to set min value", async () => {
    render(<Range max={props.max} min={props.min} />);
    const slider = await screen.findByTestId("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 256,
      top: 0,
      width: 256,
    } as DOMRect);

    const minBtn = screen.getByRole("button", {
      name: `range button min`,
    });

    fireEvent.mouseDown(minBtn);
    fireEvent.mouseMove(minBtn, {
      clientX: 128,
    });
    fireEvent.mouseUp(minBtn);

    expect(
      screen.getByRole("button", {
        name: /label button min/i,
      }).innerHTML
    ).toContain("<p>5001€</p>");
  });
  it("on linear mode, it allows user to set max value", async () => {
    render(<Range max={props.max} min={props.min} />);
    const slider = await screen.findByTestId("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 256,
      top: 0,
      width: 256,
    } as DOMRect);

    const maxBtn = screen.getByRole("button", {
      name: `range button max`,
    });

    fireEvent.mouseDown(maxBtn);
    fireEvent.mouseMove(maxBtn, {
      clientX: 200,
    });
    fireEvent.mouseUp(maxBtn);
    expect(maxBtn.style.left).toBe("200px");
    expect(
      screen.getByRole("button", {
        name: /label button max/i,
      }).innerHTML
    ).toContain("<p>7813€</p>");
  });
  it.each(["min", "max"])(
    "does not allow users to set invalid values",
    async (key) => {
      render(<Range max={props.max} min={props.min} />);
      const slider = await screen.findByTestId("slider");
      vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 20,
        right: 276,
        top: 0,
        width: 256,
      } as DOMRect);
      const button = screen.getByRole("button", {
        name: `range button ${key}`,
      });

      fireEvent.mouseDown(button);
      fireEvent.mouseMove(button, {
        clientX: key === "min" ? 10 : 300,
      });
      fireEvent.mouseUp(button);
      expect(button.style.left).toBe("0px");
      expect(
        screen.getByRole("button", {
          name: `label button ${key}`,
        }).innerHTML
      ).toContain(key === "min" ? "<p>1€</p>" : "<p>10000€</p>");
    }
  );
  it("on step mode, allow users to set min value", async () => {
    render(<Range max={70.99} min={1.99} steps={props.steps} />);
    const slider = await screen.findByTestId("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 256,
      top: 0,
      width: 256,
    } as DOMRect);
    const minBtn = screen.getByRole("button", {
      name: `range button min`,
    });

    fireEvent.mouseDown(minBtn);
    fireEvent.mouseMove(minBtn, {
      clientX: 150,
    });
    fireEvent.mouseUp(minBtn);

    expect(minBtn.style.left).toBe("153.60000000000002px");
    expect(
      screen.getByRole("button", {
        name: /label button min/i,
      }).innerHTML
    ).toContain("<p>30.99€</p>");
  });
  it("on step mode, allow users to set max value", async () => {
    render(<Range max={70.99} min={1.99} steps={props.steps} />);
    const slider = await screen.findByTestId("slider");
    vi.spyOn(slider, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 256,
      top: 0,
      width: 256,
    } as DOMRect);
    const maxBtn = screen.getByRole("button", {
      name: `range button max`,
    });

    fireEvent.mouseDown(maxBtn);
    fireEvent.mouseMove(maxBtn, {
      clientX: 170,
    });
    fireEvent.mouseUp(maxBtn);
    expect(maxBtn.style.left).toBe("153.60000000000002px");
    expect(
      screen.getByRole("button", {
        name: /label button max/i,
      }).innerHTML
    ).toContain("<p>30.99€</p>");
  });
});
