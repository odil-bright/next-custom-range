"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RangeChildrenProps, RangeProps } from "@/components/Range";
import { debounce } from "lodash";
import RangeCalculationsContext from "@/context/RangeCalculationsContext";

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

  //TODO: make hook
  const [wWidth, setWWidth] = useState(null);
  useEffect(() => {
    const handleResize = () => {
      setWWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      const currentRangeMin = 0;
      const currentRangeMax =
        sliderBoundingClientRect.width -
        knob.current.getBoundingClientRect().width;
      const xPos = calculations.mapRangeValue(
        value,
        { min, max },
        { min: currentRangeMin, max: currentRangeMax }
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
    getStep(xPos: number) {
      const knobBoundingClientRect = knob.current.getBoundingClientRect();
      const sliderBoundingClientRect = slider.current.getBoundingClientRect();
      const step = calculations.getClosestStep(
        xPos,
        sliderBoundingClientRect.width,
        steps.length - 1
      );
      if (!isMin && step.index === steps.length - 1) {
        step.point -= knobBoundingClientRect.width / 2;
      }
      return step;
    },
    isInvalidValue: (value: number) => {
      if (isMin) {
        return value < min || value > state.max;
      } else {
        return value > max || value < state.min;
      }
    },
    setStepPoint(point: number) {
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
          if (utils.isInvalidValue(value)) return;
          knob.current.style.left = utils.getXPos(currentXPos) + "px";
          utils.setValue(value);
        } else {
          const step = utils.getStep(Number(utils.getXPos(currentXPos)));
          const stepVal = steps[step.index];
          if (utils.isInvalidValue(stepVal)) return;

          knob.current.style.left = `${utils.getXPos(currentXPos)}px`;
          currentStep.current = step;

          if (stepVal !== (isMin ? state.min : state.max)) {
            utils.setValue(stepVal);
            utils.setStepPoint(step.point);
          }
        }
      },
      [isDragging, isMin, state.min, state.max, steps, utils.setValue]
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
      if (currentStep.current?.point) {
        const stepPoints = calculations.divideLineIntoEqualSegments(
          steps.length - 1,
          width
        );
        const currentStepPoint = stepPoints[currentStep.current.index];
        knob.current.style.left = `${currentStepPoint}px`;
      } else {
        knob.current.style.left = `${utils.getStep(isMin ? 0 : width).point}px`;
      }
    }
  }, [wWidth]);

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
