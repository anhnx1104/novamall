import { useState, useEffect, useRef } from "react";
import styles from "./dropdownCustom.module.css";
import { CheckIcon, UncheckIcon } from "../Ui/Form/Checkbox/checkbox";

export default function DropdownCustom({
  label,
  options,
  value,
  onChange,
  width,
  styleHeader,
  type = "single", // 'single' or 'multi'
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    type === "multi" ? (Array.isArray(value) ? value : []) : value
  );
  const [position, setPosition] = useState({ top: "100%", left: "0" });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const handleSelect = (option) => {
    if (option.disabled) return;

    if (type === "single") {
      onChange(option.value);
      setSelected(option.value);
      setOpen(false);
    } else {
      // Multi-select logic
      const currentSelected = Array.isArray(selected) ? selected : [];
      const newSelected = currentSelected.includes(option.value)
        ? currentSelected.filter((val) => val !== option.value)
        : [...currentSelected, option.value];

      onChange(newSelected);
      setSelected(newSelected);
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  // Calculate dropdown position based on viewport
  const calculatePosition = () => {
    if (!dropdownRef.current || !menuRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = dropdownRect.bottom + 4; // Default: below dropdown
    let left = dropdownRect.left;
    let transformOrigin = "top";

    // Check if dropdown would go off bottom of screen
    if (dropdownRect.bottom + menuRect.height + 8 > viewportHeight) {
      top = dropdownRect.top - menuRect.height - 4; // Position above
      transformOrigin = "bottom";
    }

    // Check if dropdown would go off right side of screen
    if (dropdownRect.left + menuRect.width > viewportWidth - 8) {
      left = dropdownRect.right - menuRect.width; // Align right edge
    }

    // Check if dropdown would go off left side of screen
    if (left < 8) {
      left = 8; // Minimum left margin
    }

    // Ensure dropdown doesn't go off top of screen
    if (top < 8) {
      top = 8;
    }

    setPosition({
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed",
      transformOrigin,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      calculatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [open]);

  return (
    <div
      className={styles.dropdown}
      style={{ width: width || "fit-content" }}
      ref={dropdownRef}
    >
      {/* Header */}
      <div
        className={styles.header}
        style={{ ...styleHeader }}
        onClick={toggleDropdown}
      >
        <span>{label}</span>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={styles.menu}
          ref={menuRef}
          style={{
            position: position.position || "absolute",
            top: position.top,
            left: position.left,
            zIndex: 9999,
            minWidth: width
              ? width == "100%"
                ? "calc(100% - 32px)"
                : width
              : "245px",
            width: "fit-content",
          }}
        >
          <div className={styles.menuHeader} onClick={() => setOpen(false)}>
            <span>{label}</span>
            <ChevronUpIcon />
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.item} ${
                option.disabled ? styles.disabled : ""
              } ${
                type === "single"
                  ? selected === option.value
                    ? styles.active
                    : ""
                  : Array.isArray(selected) && selected.includes(option.value)
                  ? styles.active
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  pointerEvents: "none",
                }}
              >
                <div style={{ width: "16px", height: "16px" }}>
                  {type === "single" ? (
                    selected === option.value ? (
                      <CheckIcon />
                    ) : (
                      <UncheckIcon />
                    )
                  ) : (
                    <>
                      {Array.isArray(selected) &&
                      selected.includes(option.value) ? (
                        <CheckIcon />
                      ) : (
                        <UncheckIcon />
                      )}
                    </>
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const ChevronUpIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8L18 13.9003L16.8817 15L12 10.1994L7.11828 15L6 13.9003L12 8Z"
      fill="var(--text-949494)"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16L18 10.0997L16.8817 9L12 13.8006L7.11828 9L6 10.0997L12 16Z"
      fill="var(--text-949494)"
    />
  </svg>
);
