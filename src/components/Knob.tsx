"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RangeChildrenProps, RangeProps } from "@/components/Range";
import { debounce } from "lodash";
import RangeCalculationsContext from "@/context/RangeCalculationsContext";
import useWindowResize from "@/hooks/useWindowResize";

export default function Knob({
  isMin = false,
  min,
  max,
  state,
  slider,
  setState,
  steps,
}: RangeProps & RangeChildrenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knob = useRef(null);
  const currentStep = useRef(null);
  const { handlers: calculations } = useContext(RangeCalculationsContext);
  const wWidth = useWindowResize();
  const [stepPoints, setStepPoints] = useState([]);

  const knobState = {
    hasChangedStep: (stepVal: number) =>
      stepVal !== (isMin ? state.min : state.max),
    isInvalidValue: (value: number) => {
      if (isMin) {
        return value < min || value > state.max;
      } else {
        return value > max || value < state.min;
      }
    },
    isCloseToStartPoint: (startPoint: number, currentPos: number) => {
      const { width } = knob.current?.getBoundingClientRect();
      const offset = width / 2;
      return startPoint - currentPos < offset && startPoint - currentPos > 0;
    },
    isCloseToEndPoint: (endPoint: number, currentPos: number) => {
      const { width } = knob.current?.getBoundingClientRect();
      const offset = width / 2;
      return currentPos - endPoint < offset / 2 && currentPos - endPoint > 0;
    },
  };

  const utils = {
    setValue: useCallback(
      debounce((value: number) => {
        if (isNaN(value)) return;
        if (isMin) {
          setState((state) => ({ ...state, min: value }));
        } else setState((state) => ({ ...state, max: value }));
      }, 10),
      [isMin, setState]
    ),
    getValueFromXPos: (currentPos: number) => {
      const sliderBoundingClientRect = slider.current?.getBoundingClientRect();
      const rangeMin = sliderBoundingClientRect.left;
      const rangeMax = sliderBoundingClientRect.right;
      let value: number;

      switch (true) {
        case knobState.isCloseToEndPoint(rangeMax, currentPos):
          value = max;
          break;
        case knobState.isCloseToStartPoint(rangeMin, currentPos):
          value = min;
          break;
        default:
          value = calculations.mapRangeValue(
            currentPos,
            { min: rangeMin, max: rangeMax },
            { min, max }
          );
      }

      return Math.round(value);
    },
    getXPosFromValue: (value = isMin ? state.min : state.max) => {
      const sliderBoundingClientRect = slider.current?.getBoundingClientRect();
      const currentRangeMax = sliderBoundingClientRect.width;
      const xPos = calculations.mapRangeValue(
        value,
        { min, max },
        { min: 0, max: currentRangeMax }
      );
      return xPos;
    },
    getXPos: (pageX: number): number | void => {
      const sliderBoundingClientRect = slider.current?.getBoundingClientRect();
      if (
        sliderBoundingClientRect.left <= pageX &&
        sliderBoundingClientRect.right >= pageX
      ) {
        const xPos = pageX - sliderBoundingClientRect.left;
        return xPos;
      }
    },
    getStep: (xPos: number) => {
      const step = calculations.getClosestStep(xPos, stepPoints);
      return step;
    },
    setStepPoint: (point: number) => {
      if (isNaN(point)) return;
      knob.current.style.transition = "left 0.05s";
      knob.current.style.left = `${point}px`;
    },
  };

  const handlers = {
    onMove: useCallback(
      (currentXPos: number) => {
        if (!isDragging) return;

        if (!steps) {
          const value = utils.getValueFromXPos(currentXPos);
          if (knobState.isInvalidValue(value)) return;
          knob.current.style.left = utils.getXPos(currentXPos) + "px";
          utils.setValue(value);
        } else {
          const step = utils.getStep(Number(utils.getXPos(currentXPos)));
          const stepVal = steps[step.index];
          if (knobState.isInvalidValue(stepVal)) return;

          knob.current.style.left = `${utils.getXPos(currentXPos)}px`;
          currentStep.current = step;

          if (knobState.hasChangedStep(stepVal)) {
            utils.setValue(stepVal);
            utils.setStepPoint(step.point);
          }
        }
      },
      [isDragging, steps, knobState, knob, currentStep, stepPoints]
    ),
    onStart: () => {
      knob.current.style.zIndex = 1;
      setIsDragging(true);
    },
    onLeave: () => {
      knob.current.style.zIndex = 0;
      if (steps && currentStep.current) {
        utils.setStepPoint(currentStep.current.point);
      }
      setIsDragging(false);
    },
  };

  // ## STEPS
  // Reset step points on window width change
  useEffect(() => {
    if (steps && slider?.current) {
      const { width } = slider.current.getBoundingClientRect();
      const segments = calculations.divideLineIntoEqualSegments(
        steps.length - 1,
        width
      );
      if (segments?.length > 0) setStepPoints(segments);
    }
  }, [wWidth, slider.current]);

  // Update knob position on step points change
  useEffect(() => {
    if (steps && slider?.current) {
      if (currentStep.current?.index) {
        const currentStepPoint = stepPoints[currentStep.current.index];
        knob.current.style.left = `${currentStepPoint}px`;
      } else {
        const { width } = slider.current.getBoundingClientRect();
        knob.current.style.left = `${utils.getStep(isMin ? 0 : width).point}px`;
      }
    }
  }, [stepPoints, slider.current]);

  // ## LINEAR
  // Update Knob position on window wWidth/state/ change
  useEffect(() => {
    if (!isDragging && !steps) {
      knob.current.style.left = `${utils.getXPosFromValue()}px`;
    }
  }, [wWidth, state]);

  return (
    <button
      className="range__slider__knob"
      aria-label={`range button ${isMin ? "min" : "max"}`}
      ref={knob}
      onMouseMove={(ev) => handlers.onMove(ev.pageX)}
      onMouseDown={handlers.onStart}
      onMouseUp={handlers.onLeave}
      onMouseLeave={handlers.onLeave}
      onTouchStart={handlers.onStart}
      onTouchMove={(ev) => handlers.onMove(ev.touches[0].clientX)}
      onTouchEnd={handlers.onLeave}
      onTransitionEnd={() => {
        knob.current.style.transitionProperty = "none";
      }}
    />
  );
}
