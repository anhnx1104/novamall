import styles from "./cscenter.module.css";
import SidebarCsCenter from "./sidebarCsCenter";

export default function LayoutCsCenter({ children }) {
  return (
    <>
      <div className={styles.content_container + " bg_star"}>
        <div className={`${styles.custom_container} custom_container`}>
          <SidebarCsCenter />
          <div className={styles.children_container}>{children}</div>
        </div>
      </div>
    </>
  );
}
