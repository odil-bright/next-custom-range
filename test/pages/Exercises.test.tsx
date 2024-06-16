import Exercise1 from "@/components/Exercise1";
import Exercise2 from "@/components/Exercise2";
import { render, screen, act } from "@testing-library/react";
import { Suspense } from "react";

describe("renders page main components", () => {
  it.each([Exercise1, Exercise2])("renders range", async (promise) => {
    const Component = await promise();
    render(Component);

    const rangeComponent = await screen.findByTestId("range");
    screen.logTestingPlaygroundURL();
    expect(rangeComponent).toBeDefined();
  });
});
