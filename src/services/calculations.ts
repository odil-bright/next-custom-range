import { RangeCalculationsHandlers } from "@/context/RangeCalculationsContext";
import { Range } from "@/models/entities";

function getDistance(p1: number, p2: number) {
  return Math.abs(p1 - p2);
}

export const handlers: RangeCalculationsHandlers = {
  mapRangeValue: (
    currentPos: number,
    originRange: Range,
    targetRange: Range
  ) => {
    const posXPercent =
      (currentPos - originRange.min) / (originRange.max - originRange.min);
    const rangeValue =
      posXPercent * (targetRange.max - targetRange.min) + targetRange.min;
    return rangeValue;
  },
  divideLineIntoEqualSegments: (numSegments: number, lineLength: number) => {
    const segmentLength = lineLength / numSegments;
    const initPoints = [0, lineLength];
    const newPoints = [0];
    let accumulatedLength = 0;

    for (let i = 0; i < initPoints.length - 1; i++) {
      const startPoint = initPoints[i];
      const endPoint = initPoints[i + 1];
      const segmentLengthCurrent = getDistance(startPoint, endPoint);

      while (accumulatedLength + segmentLength <= segmentLengthCurrent) {
        accumulatedLength += segmentLength;
        const t = accumulatedLength / segmentLengthCurrent;
        const newPoint = startPoint + t * (endPoint - startPoint);
        newPoints.push(newPoint);
      }
      accumulatedLength -= segmentLengthCurrent - accumulatedLength;
    }
    return newPoints;
  },
  getClosestStep: (point: number, lineLength: number, numSteps: number) => {
    const segmentPoints = handlers.divideLineIntoEqualSegments(
      numSteps,
      lineLength
    );

    const closestPointIndex = segmentPoints.findIndex((p, index, arr) => {
      const distance = getDistance(point, p);
      const nextDistance =
        index < arr.length - 1 ? getDistance(point, arr[index + 1]) : Infinity;
      return distance <= nextDistance;
    });

    return {
      point: segmentPoints[closestPointIndex],
      index: closestPointIndex,
    };
  },
};
