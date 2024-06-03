"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RangeChildrenProps, RangeProps, RangeState } from "./Range";

export function InputLabel({
  setState,
  state,
  toEdit = false,
  min,
  max,
  isMin = false,
}: RangeProps & RangeChildrenProps) {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    isMin ? state.min : state.max
  );
  const utils = {
    setValue: (value: number) => {
      switch (true) {
        case isMin && value >= min && value <= state.max:
          setState((state) => ({ ...state, min: value }));
          break;
        case !isMin && value <= max && value >= state.min:
          setState((state) => ({ ...state, max: value }));
          break;
      }
    },
  };
  useEffect(() => {
    if (editing) {
      setEditing(false);
      setCurrentValue(isMin ? min : max);
    }
  }, [state]);

  return (
    <div className={`range__label ${isMin ? "range__label--min" : ""}`}>
      {toEdit && editing ? (
        <input
          type="number"
          aria-label={`label inputs ${isMin ? "min" : "max"}`}
          value={currentValue}
          onChange={(ev) => {
            setCurrentValue(Number(ev.target.value));
          }}
          onBlur={(ev) => {
            const value = Number((ev.target as HTMLInputElement).value);
            if (value !== currentValue) utils.setValue(value);
            setEditing(false);
          }}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              const value = Number((ev.target as HTMLInputElement).value);
              utils.setValue(value);
            }
          }}
        />
      ) : (
        <button
          onClick={() => setEditing(!editing)}
          disabled={!toEdit}
          aria-label={`label button ${isMin ? "min" : "max"}`}
        >
          <p>{isMin ? state.min : state.max}€</p>
        </button>
      )}
    </div>
  );
}
