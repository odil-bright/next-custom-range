import Exercise1 from "@/components/Exercise1";
import Exercise2 from "@/components/Exercise2";
import { render, screen, act } from "@testing-library/react";

describe("renders page main components", () => {
  it("renders exercise 1 range", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue({ range: [1, 10000] }),
    });
    const Component = await Exercise1();
    render(Component);

    const rangeComponent = await screen.findByTestId("range");
    expect(rangeComponent).toBeDefined();
  });
  it("renders range", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: vi
        .fn()
        .mockResolvedValue({ steps: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }),
    });
    const Component = await Exercise2();
    render(Component);

    const rangeComponent = await screen.findByTestId("range");
    screen.logTestingPlaygroundURL();
    expect(rangeComponent).toBeDefined();
  });
});
