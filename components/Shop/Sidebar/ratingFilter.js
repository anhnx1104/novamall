import React, { useCallback, useEffect, useState, useRef } from "react";
import c from "./ratingFilter.module.css";

const stars = [5, 4, 3, 2, 1, 0];

export const RatingFilter = ({ onChange }) => {
  const [selectedStars, setSelectedStars] = useState([]);

  const handleSelectStar = (star) => {
    setSelectedStars((prevSelected) => {
      let newSelection;
      if (prevSelected.includes(star)) {
        newSelection = prevSelected.filter((s) => s !== star);
      } else {
        newSelection = [...prevSelected, star];
      }
      onChange?.(newSelection);
      return newSelection;
    });
  };

  return (
    <div className={c.container}>
      {stars.map((star) => (
        <div
          key={star}
          className={`${c.item} ${
            selectedStars.includes(star) ? c.selected : ""
          }`}
          onClick={() => handleSelectStar(star)}
        >
          <div className={c.starBox}>
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill={i < star ? "#FFAA00" : "#ddd"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.00003 12.3959L4.5417 14.4792C4.38892 14.5765 4.2292 14.6181 4.06253 14.6042C3.89586 14.5904 3.75003 14.5348 3.62503 14.4376C3.50003 14.3404 3.40281 14.219 3.33336 14.0734C3.26392 13.9279 3.25003 13.7645 3.2917 13.5834L4.20836 9.64592L1.14586 7.00008C1.00697 6.87508 0.920308 6.73258 0.885863 6.57258C0.851419 6.41258 0.861697 6.25647 0.916697 6.10425C0.971697 5.95203 1.05503 5.82703 1.1667 5.72925C1.27836 5.63147 1.43114 5.56897 1.62503 5.54175L5.6667 5.18758L7.2292 1.47925C7.29864 1.31258 7.40642 1.18758 7.55253 1.10425C7.69864 1.02091 7.84781 0.979248 8.00003 0.979248C8.15225 0.979248 8.30142 1.02091 8.44753 1.10425C8.59364 1.18758 8.70142 1.31258 8.77086 1.47925L10.3334 5.18758L14.375 5.54175C14.5695 5.56953 14.7223 5.63203 14.8334 5.72925C14.9445 5.82647 15.0278 5.95147 15.0834 6.10425C15.1389 6.25703 15.1495 6.41341 15.115 6.57341C15.0806 6.73341 14.9936 6.87564 14.8542 7.00008L11.7917 9.64592L12.7084 13.5834C12.75 13.764 12.7361 13.9273 12.6667 14.0734C12.5973 14.2195 12.5 14.3409 12.375 14.4376C12.25 14.5342 12.1042 14.5898 11.9375 14.6042C11.7709 14.6187 11.6111 14.577 11.4584 14.4792L8.00003 12.3959Z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const MultiRangeSlider = ({ min = 0, max = 5, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

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

  // Update parent component when values change
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
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
          const value = Math.min(Number(event.target.value), maxVal - 0.1);
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
          const value = Math.max(Number(event.target.value), minVal + 0.1);
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
          <input
            type="number"
            value={minVal}
            min={min}
            max={max}
            step="0.1"
            hidden
            className={c.num}
            onChange={(event) => {
              const value = Math.min(
                +event.target.value < +min ? +min : +event.target.value,
                maxVal - 0.1
              );
              setMinVal(value);
              minValRef.current = value;
            }}
          />
          <span> {minVal.toFixed(1)} ★ </span>
        </div>
        <div className={c.slider__right_value}>
          <input
            type="number"
            value={maxVal}
            min={min}
            max={max}
            step="0.1"
            hidden
            className={c.num}
            onChange={(event) => {
              const value = Math.max(
                +event.target.value > +max ? +max : +event.target.value,
                minVal + 0.1
              );
              setMaxVal(value);
              maxValRef.current = value;
            }}
          />
          <span> {maxVal.toFixed(1)} ★ </span>
        </div>
      </div>
    </div>
  );
};
