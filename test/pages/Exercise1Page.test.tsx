import Exercise1Page from "@/app/exercise1/page";
import RootLayout from "@/app/layout";
import { render, screen } from "@testing-library/react";

describe("renders page component and layout", () => {
  it("renders exercise 1 range", async () => {
    vi.mock("@/components/Exercise1", () => {
      return {
        default: () => <div></div>,
      };
    });
    const Component = await Exercise1Page();
    render(Component, { wrapper: RootLayout });
    screen.debug;
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/prueba técnica \- odil bright/i)).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: /linear range/i,
      })
    ).toBeDefined();
  });
});
