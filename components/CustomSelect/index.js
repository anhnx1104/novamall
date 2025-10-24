import { useEffect, useState, useRef } from "react";
import styles from "./customSelect.module.css";

export default function CustomSelect({
  list = [],
  preIndex,
  value,
  dataChange,
  rootIndex,
  placeholder = "전체",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [index, setIndex] = useState(preIndex || 0);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const dataChangeRef = useRef(dataChange);

  // Keep a stable reference to dataChange to avoid triggering useEffect loops
  useEffect(() => {
    dataChangeRef.current = dataChange;
  }, [dataChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
    if (typeof dataChangeRef.current === "function") {
      dataChangeRef.current(value, rootIndex);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.header} onClick={toggleDropdown}>
        <span className={styles.selected}>
          {selected ? (
            <>{selected}</>
          ) : (
            <span style={{ color: "#999" }}>{placeholder}</span>
          )}
        </span>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>

      {isOpen && (
        <div className={styles.menu} ref={menuRef}>
          {/* Show selected item at top with arrow */}

          {/* Show all other items except the currently selected one */}
          {list
            .filter((item) => item.value !== selected)
            .map((item, i) => {
              if (i + 1 === index) return null; // Skip currently selected item
              return (
                <div
                  key={i}
                  className={styles.item}
                  onClick={() => handleSelect(item.value)}
                >
                  {item.label}
                </div>
              );
            })}
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
      fill="#949494"
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
      fill="#949494"
    />
  </svg>
);
