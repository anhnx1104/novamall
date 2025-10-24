import { useRef } from "react";
import classes from "./checkboxCustom.module.css";

export default function CheckboxCustom({
  label,
  value,
  name,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  width = "24px",
  content,
  unCheckIcon,
}) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    if (onChange && !disabled) {
      const checked = event.target.checked;
      onChange(checked);
    }
  };

  const handleIconClick = (e) => {
    // Prevent the event from bubbling up and causing duplicate clicks
    e.stopPropagation();
    if (!disabled && inputRef.current) {
      // Programmatically click the input to trigger the change event
      inputRef.current.click();
    }
  };
  
  const UnCheckIcon = () => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleIconClick}
    >
      <rect
        x="1"
        y="1"
        width="28"
        height="28"
        rx="14"
        stroke="#B4B4CC"
        stroke-opacity="0.5"
        stroke-width="2"
      />
      <path
        d="M12.3424 21.25L7.5 16.0071L8.88758 14.5047L12.3424 18.2453L21.1124 8.75L22.5 10.2523L12.3424 21.25Z"
        fill="#B4B4CC"
        fill-opacity="0.5"
        onClick={handleIconClick}
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "calc(" + width + "/1.8)",
        height: "calc(" + width + "/1.8)",
      }}
      onClick={handleIconClick}
    >
      <path
        d="M3.87394 10L0 5.80566L1.11007 4.60379L3.87394 7.59625L10.8899 0L12 1.20188L3.87394 10Z"
        fill="white"
        onClick={handleIconClick}
      />
    </svg>
  );

  return (
    <div className={`${classes.checkboxContainer} ${className}`}>
      <input
        ref={inputRef}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={classes.checkboxInput}
      />
      <span
        className={
          unCheckIcon ? classes.checkboxCheckFull : classes.checkboxCheck
        }
        style={{ width: width, height: width, minWidth: width }}
      >
        {unCheckIcon ? (
          checked ? (
            <CheckIcon />
          ) : (
            <UnCheckIcon />
          )
        ) : (
          <CheckIcon />
        )}
      </span>
      <div className={classes.content}>
        {content}
        {label && <span className={classes.checkboxLabel}>{label}</span>}
      </div>
    </div>
  );
}
