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
    isMaxStep: currentStep.current?.index === steps?.length - 1,
    stepChanged: (stepVal: number) =>
      stepVal !== (isMin ? state.min : state.max),
    isInvalidValue: (value: number) => {
      if (isMin) {
        return value < min || value > state.max;
      } else {
        return value > max || value < state.min;
      }
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
      const currentRangeMin = sliderBoundingClientRect.left;
      const currentRangeMax = sliderBoundingClientRect.right;
      const value = calculations.mapRangeValue(
        currentPos,
        { min: currentRangeMin, max: currentRangeMax },
        { min, max }
      );
      return Math.round(value);
    },
    getXPosFromValue: (value = isMin ? state.min : state.max) => {
      const sliderBoundingClientRect = slider.current?.getBoundingClientRect();
      const currentRangeMax =
        sliderBoundingClientRect.width -
        knob.current.getBoundingClientRect().width;
      const xPos = calculations.mapRangeValue(
        value,
        { min, max },
        { min: 0, max: currentRangeMax }
      );
      return xPos;
    },
    getXPos: (pageX: number): number | void => {
      const sliderBoundingClientRect = slider.current?.getBoundingClientRect();
      const knobBoundingClientRect = knob.current.getBoundingClientRect();
      const xPosMin = pageX - knobBoundingClientRect.width / 2;
      if (
        sliderBoundingClientRect.left <= xPosMin &&
        sliderBoundingClientRect.right >= pageX
      ) {
        const xPos =
          pageX -
          sliderBoundingClientRect.left -
          knobBoundingClientRect.width / 2;
        return xPos;
      }
    },
    // get current step from knob position
    getStep: (xPos: number) => {
      const knobBoundingClientRect = knob.current.getBoundingClientRect();
      const step = calculations.getClosestStep(xPos, stepPoints);
      if (step.index === steps.length - 1) {
        step.point -= knobBoundingClientRect.width / 2;
      }
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

          if (knobState.stepChanged(stepVal)) {
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

  useEffect(() => {
    if (!isDragging && !steps) {
      knob.current.style.left = `${utils.getXPosFromValue()}px`;
    }
  }, [knob, state, wWidth]);

  useEffect(() => {
    if (steps && slider?.current) {
      const { width } = slider.current.getBoundingClientRect();
      if (currentStep.current?.index) {
        const currentStepPoint = stepPoints[currentStep.current.index];
        knob.current.style.left = `${utils.getStep(currentStepPoint).point}px`;
      } else {
        knob.current.style.left = `${utils.getStep(isMin ? 0 : width).point}px`;
      }
    }
  }, [stepPoints, slider.current]);

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
