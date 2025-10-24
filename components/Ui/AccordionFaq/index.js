import { useState } from "react";
import classes from "./accordion.module.css";
import { Plus } from "@styled-icons/bootstrap";
import { Dash } from "@styled-icons/bootstrap";

const AccordionFaq = ({ title, children, state }) => {
  const [isOpen, setIsOpen] = useState(state || true);
  const toggleCardBody = () => setIsOpen(!isOpen);
  return (
    <div className={`${classes.card} ${!isOpen ? classes.open : ""}`}>
      <div className={classes.header} onClick={toggleCardBody}>
        {title}
        <div className={classes.icon} aria-expanded={isOpen}>
          {isOpen ? <Plus /> : <Dash />}
        </div>
      </div>

      <div className={classes.body_container} aria-expanded={isOpen}>
        <div className={classes.body}>{children}</div>
      </div>
    </div>
  );
};

export default AccordionFaq;
