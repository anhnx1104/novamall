import React, { useState, useRef, useEffect } from "react";
import styles from "./searchSelect.module.css";

const SearchSelect = ({ options = [] }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setSearchTerm(option.title);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setOpen(true);

    if (value.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(
        (option) =>
          option.title.toLowerCase().includes(value.toLowerCase()) ||
          option.sub.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleInputClick = () => {
    setOpen(true);
    setFilteredOptions(options);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.label}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={"보낼 아이디"}
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={() => {
            setOpen(true);
            setFilteredOptions(options);
          }}
        />
        <span
          className={styles.arrow}
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setFilteredOptions(options);
            }
          }}
        >
          <IconSearch />
        </span>
      </div>

      {open && filteredOptions.length > 0 && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {filteredOptions.map((option, idx) => (
            <div
              key={idx}
              className={`${styles.option} ${
                selected?.title === option.title ? styles.active : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className={styles.title}>{option.title}</div>
              <div className={styles.sub}>{option.sub}</div>
            </div>
          ))}
        </div>
      )}

      {open && filteredOptions.length === 0 && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>검색 결과가 없습니다</div>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;

const IconSearch = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.875 11.75C14.94 11.75 11.75 14.94 11.75 18.875C11.75 22.81 14.94 26 18.875 26C22.81 26 26 22.81 26 18.875C26 14.94 22.81 11.75 18.875 11.75ZM10 18.875C10 13.9735 13.9735 10 18.875 10C23.7765 10 27.75 13.9735 27.75 18.875C27.75 23.7765 23.7765 27.75 18.875 27.75C13.9735 27.75 10 23.7765 10 18.875Z"
        fill="var(--text-121212)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.9063 23.9063C24.248 23.5646 24.802 23.5646 25.1437 23.9063L29.4937 28.2563C29.8354 28.598 29.8354 29.152 29.4937 29.4937C29.152 29.8354 28.598 29.8354 28.2563 29.4937L23.9063 25.1437C23.5646 24.802 23.5646 24.248 23.9063 23.9063Z"
        fill="var(--text-121212)"
      />
    </svg>
  );
};
