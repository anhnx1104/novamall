import React from "react";
import c from "./buttonCustom.module.css";
const ButtonCustom = ({ text, onClick, className, variant, style, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`${c.button} ${className || ""} ${c[variant] || ""}`}
      style={style}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default ButtonCustom;
