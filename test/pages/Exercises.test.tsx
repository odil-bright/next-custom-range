import Exercise1 from "@/components/Exercise1";
import Exercise2 from "@/components/Exercise2";
import {
  ApiOperations,
  ApiOperationsProvider,
} from "@/context/ApiOperationsContext";
import { render, screen, act } from "@testing-library/react";

const mockedApiOperations: ApiOperations = {
  getPriceRange: async () => {
    return { range: [1, 10000] };
  },
  getPriceSteps: async () => {
    return { steps: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] };
  },
};

describe("renders page main components", async () => {
  it.each([<Exercise1 />, <Exercise2 />])("renders", async (component) => {
    await act(async () =>
      render(
        <ApiOperationsProvider operations={mockedApiOperations}>
          {component}
        </ApiOperationsProvider>
      )
    );

    const heading = screen.getByRole("heading", {
      level: 1,
    });
    expect(heading).toBeDefined();
  });
  it.each([<Exercise1 />, <Exercise2 />])(
    "renders range",
    async (component) => {
      await act(async () =>
        render(
          <ApiOperationsProvider operations={mockedApiOperations}>
            {component}
          </ApiOperationsProvider>
        )
      );

      const rangeComponent = screen.getByTestId("range");
      expect(rangeComponent).toBeDefined();
    }
  );
});
