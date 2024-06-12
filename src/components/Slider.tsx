"use-client";

import { useEffect, useRef, useState } from "react";
import Knob from "./Knob";
import { RangeChildrenProps, RangeProps } from "./Range";

export default function Slider({
  steps,
  min,
  max,
  state,
  setState,
}: RangeProps & RangeChildrenProps) {
  const sliderRef = useRef(null);
  return (
    <div className="range__slider" ref={sliderRef} role="slider">
      <div className="range__slider__bar" data-testid={"range-bar"} />
      <Knob
        slider={sliderRef}
        aria-label="range button min"
        state={state}
        max={max}
        min={min}
        setState={setState}
        isMin={true}
        steps={steps}
      />
      <Knob
        slider={sliderRef}
        aria-label="range button max"
        state={state}
        max={max}
        min={min}
        setState={setState}
        steps={steps}
      />
    </div>
  );
}
