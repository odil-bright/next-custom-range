import Exercise2Page from "@/app/exercise2/page";
import RootLayout from "@/app/layout";
import { render, screen } from "@testing-library/react";

describe("renders page component and layout", () => {
  it("renders exercise 1 range", async () => {
    vi.mock("@/components/Exercise2", () => {
      return {
        default: () => <div></div>,
      };
    });
    const Component = await Exercise2Page();
    render(Component, { wrapper: RootLayout });
    screen.debug;
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/prueba técnica \- odil bright/i)).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: /steps range/i,
      })
    ).toBeDefined();
  });
});
