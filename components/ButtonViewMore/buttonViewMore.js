import classes from "./buttonViewMore.module.css";
import { ArrowMoreIcon } from "~/components/Ui/Icons/icons";
export const ButtonViewMore = ({ onClick, label }) => {
  return (
    <button onClick={onClick} className={classes.buttonViewMore}>
      {label}
      <ArrowMoreIcon />
    </button>
  );
};
