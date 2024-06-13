import { Range } from "@/models/entities";
import { PropsWithChildren, createContext } from "react";

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
    segmentPoints: number[]
  ) => {
    point: number;
    index: number;
  };
}

interface RangeCalculationsContext {
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
}: PropsWithChildren<{ handlers: RangeCalculationsHandlers }>) => {
  return (
    <RangeCalculationsContext.Provider value={{ handlers }}>
      {children}
    </RangeCalculationsContext.Provider>
  );
};

export { RangeCalculationsProvider };
export default RangeCalculationsContext;
