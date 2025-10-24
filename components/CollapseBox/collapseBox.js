import { useState } from "react";
import styles from "./collapseBox.module.css";

export default function CollapseBox({ header, show = false, content }) {
  const [open, setOpen] = useState(show);

  return (
    <div className={styles.container}>
      {/* Header */}
      <button className={styles.header} onClick={() => setOpen(!open)}>
        <span>{header}</span>
        <ArrowIcon
          className={`${styles.icon} ${
            !open ? styles.rotateUp : styles.rotateDown
          }`}
        />
      </button>

      {/* Content */}
      {open && <div className={styles.content}>{content}</div>}
    </div>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 10.8337L8 18.7007L9.49105 20.167L16 13.7662L22.509 20.167L24 18.7007L16 10.8337Z"
        fill="#757575"
      />
    </svg>
  );
}
