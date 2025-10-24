import { useState } from "react";
import classes from "./selectCustom.module.css";

export default function SelectCustom({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  name,
  error,
  label,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const ArrowIcon = ({ isOpen }) => (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${classes.arrow} ${isOpen ? classes.arrowOpen : ""}`}
    >
      <path d="M6 6L0 0H12L6 6Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`${classes.selectWrapper} ${className}`}>
      {label && <label className={classes.label}>{label}</label>}
      <div
        className={`${classes.selectContainer} ${
          disabled ? classes.disabled : ""
        } ${error ? classes.error : ""} ${isOpen ? classes.open : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        tabIndex={0}
      >
        <div className={classes.selectDisplay}>
          <span
            className={`${classes.selectedText} ${
              !selectedOption ? classes.placeholder : ""
            }`}
          >
            {displayText}
          </span>
          <ArrowIcon isOpen={isOpen} />
        </div>

        {isOpen && (
          <div className={classes.optionsList}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${classes.option} ${
                  option.value === value ? classes.optionSelected : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
            {options.length === 0 && (
              <div className={classes.noOptions}>No options available</div>
            )}
          </div>
        )}
      </div>
      {error && <span className={classes.errorText}>{error}</span>}
    </div>
  );
}
