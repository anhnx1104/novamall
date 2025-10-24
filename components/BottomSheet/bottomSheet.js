import { useEffect } from "react";
import Modal from "react-modal";
import classes from "./bottomSheet.module.css";
import { XLg } from "@styled-icons/bootstrap";

Modal.setAppElement("#__next");

const BottomSheet = ({ open, onClose, content, action, styleAction }) => {
  // useEffect(() => {
  //   document.documentElement.style.overflow = open ? "hidden" : "";
  // }, [open]);

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      className={classes.container}
      overlayClassName={classes.overlay}
    >
      <div>
        <div className={classes.drawer}>
          <div className={classes.drawerTouch} onClick={onClose}></div>
        </div>
        <div className={classes.body}>{content}</div>
        {action && (
          <div className={classes.action} style={styleAction}>
            {action}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BottomSheet;
