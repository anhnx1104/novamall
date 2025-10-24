import React, { useCallback, useEffect, useState, useRef } from "react";
import c from "./ratingRangeFilter.module.css";

const RatingRangeSlider = ({ min = 0.0, max = 5.0, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);
  const timeoutRef = useRef(null);

  // Update minVal and maxVal when min or max props change
  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
    minValRef.current = min;
    maxValRef.current = max;
  }, [min, max]);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Debounced update of parent component
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange({ min: minVal, max: maxVal });
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minVal, maxVal, onChange]);

  return (
    <div className={c.container}>
      <input
        type="range"
        min={min}
        max={max}
        step="0.1"
        value={minVal}
        onChange={(event) => {
          const value = Math.min(
            Math.max(Number(event.target.value), min),
            maxVal - 0.1
          );
          setMinVal(value);
          minValRef.current = value;
        }}
        className={`${c.thumb} ${c.thumb_left}`}
        style={{ zIndex: minVal > max - 1 ? "5" : "3" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step="0.1"
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(
            Math.min(Number(event.target.value), max),
            minVal + 0.1
          );
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className={`${c.thumb} ${c.thumb_right}`}
      />

      <div className={c.slider}>
        <div className={c.slider__track} />
        <div ref={range} className={c.slider__range} />
      </div>
      <div className={c.input}>
        <div className={c.slider__left_value}>
          <span> {minVal.toFixed(1)} ★ </span>
        </div>
        <div className={c.slider__right_value}>
          <span> {maxVal.toFixed(1)} ★ </span>
        </div>
      </div>
    </div>
  );
};

export default RatingRangeSlider;
