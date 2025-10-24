import React, { useState } from "react";
import c from "./colorFilter.module.css";
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";

const ColorFilter = ({ onChange }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const { data } = useSWR("/api/colors", fetchData);
  const colors = data?.colors || [];

  const handleSelectColor = (color) => {
    setSelectedColors((prevSelected) => {
      let newSelection;
      if (prevSelected.includes(color.name)) {
        newSelection = prevSelected.filter((c) => c !== color.name);
      } else {
        newSelection = [...prevSelected, color.name];
      }
      onChange?.(newSelection);
      return newSelection;
    });
  };

  return (
    <div className={c.container}>
      {colors.map((color) => (
        <div
          className={c.item}
          key={color._id}
          onClick={() => handleSelectColor(color)}
        >
          <div
            className={`${c.colorBox} ${
              selectedColors.includes(color.name) ? c.selected : ""
            }`}
            style={{ backgroundColor: color.value }}
          >
            {selectedColors.includes(color.name) && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75 9L7.5 12.75L15 5.25"
                  stroke={color.value === "#ffffff" ? "#000" : "#ffffff"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className={c.colorName}>{color.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorFilter;
