import { Range } from "@/models/entities";
import { ReactNode, createContext, useState } from "react";

interface RangeCalculationsData {
  segments: number[];
}

export interface RangeCalculationsHandlers {
  mapRangeValue: (
    currentPos: number,
    originRange: Range,
    targetRange: Range
  ) => number;
  divideLineIntoEqualSegments: (
    numSegments: number,
    lineLength: number
  ) => number[];
  getClosestStep: (
    point: number,
    lineLength: number,
    numSteps: number
  ) => {
    point: number;
    index: number;
  };
}

interface RangeCalculationsContext {
  /* data: RangeCalculationsData; */
  handlers: RangeCalculationsHandlers;
}

const RangeCalculationsContext = createContext<
  RangeCalculationsContext | undefined
>(undefined);

const initState: RangeCalculationsData = {
  segments: null,
};

const RangeCalculationsProvider = ({
  children,
  handlers,
}: {
  children: ReactNode;
  handlers: RangeCalculationsHandlers;
}) => {
  return (
    <RangeCalculationsContext.Provider value={{ handlers }}>
      {children}
    </RangeCalculationsContext.Provider>
  );
};

export { RangeCalculationsProvider };
export default RangeCalculationsContext;
