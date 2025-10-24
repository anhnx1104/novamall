import { useEffect } from "react";
import Modal from "react-modal";
import classes from "./popup.module.css";
import { XLg } from "@styled-icons/bootstrap";

Modal.setAppElement("#__next");

const Popup = ({
  open,
  onClose,
  small,
  title,
  content,
  action,
  styleAction,
  bgTransparent,
}) => {
  // useEffect(() => {
  //   document.documentElement.style.overflow = open ? "hidden" : "";
  // }, [open]);

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      className={
        (small ? classes.container_small : classes.container) +
        " " +
        (bgTransparent ? classes.bgTransparent : "")
      }
      overlayClassName={classes.overlay}
    >
      {title && <h2 className={classes.title}>{title}</h2>}
      <div style={{}}>
        <div className={classes.body}>{content}</div>
        <div className={classes.action} style={styleAction}>
          {action}
        </div>
      </div>
    </Modal>
  );
};

export default Popup;
