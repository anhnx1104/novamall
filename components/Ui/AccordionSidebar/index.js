import { useState } from "react";
import classes from "./accordion.module.css";
import { Plus } from "@styled-icons/bootstrap";
import { Dash } from "@styled-icons/bootstrap";

const AccordionSidebar = ({ title, children, state, dashed }) => {
  const [isOpen, setIsOpen] = useState(state);
  const toggleCardBody = () => setIsOpen(!isOpen);
  return (
    <div
      className={`${classes.card} ${!isOpen ? classes.open : ""} ${
        dashed ? classes.dashed : classes.solid
      }`}
    >
      <div className={classes.header} onClick={toggleCardBody}>
        {title}
        <div
          className={`${classes.icon} ${isOpen ? classes.icon_active : ""}`}
          aria-expanded={isOpen}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1611 16.3333L13.844 10.0162C13.3779 9.55006 12.6222 9.55006 12.1561 10.0162L5.83899 16.3333"
              stroke="#202020"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className={classes.body_container} aria-expanded={isOpen}>
        <div className={classes.body}>{children}</div>
      </div>
    </div>
  );
};

export default AccordionSidebar;
