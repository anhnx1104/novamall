import { useState } from "react";
import classes from "./checkbox.module.css";

export default function Checkbox({
  label,
  value,
  name,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  width = "16px",
  mode = "light",
  labelSize = "14px",
}) {
  const handleChange = (event) => {
    if (onChange && !disabled) {
      const value = event.target.value;
      // Handle boolean conversion for string values
      if (value === "true") {
        onChange(true);
      } else if (value === "false") {
        onChange(false);
      } else {
        onChange(value);
      }
    }
  };

  return (
    <label className={`${classes.checkboxContainer} ${className}`}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={classes.checkboxInput}
      />
      {checked && (
        <span
          className={classes.checkboxIcon}
          style={{ width: width, height: width }}
        >
          <CheckIcon />
        </span>
      )}
      {!checked && (
        <span
          className={classes.checkboxIcon}
          style={{ width: width, height: width }}
        >
          <UncheckIcon />
        </span>
      )}
      {label && (
        <span className={classes.checkboxLabel} style={{ fontSize: labelSize }}>
          {label}
        </span>
      )}
    </label>
  );
}
export const UncheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="15"
      height="15"
      rx="1.5"
      fill="white"
      stroke="var(--stroke-E8ECEF)"
    />
    <path
      d="M5.87394 13L2 8.80566L3.11007 7.60379L5.87394 10.5962L12.8899 3L14 4.20188L5.87394 13Z"
      fill="var(--stroke-E8ECEF)"
    />
  </svg>
);
export const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="16" rx="2" fill="var(--text-121212)" />
    <path
      d="M5.87394 13L2 8.80566L3.11007 7.60379L5.87394 10.5962L12.8899 3L14 4.20188L5.87394 13Z"
      fill="white"
    />
  </svg>
);
