import styles from "./profile.module.css";
import SidebarProfile from "./sidebarProfile";

export default function LayoutProfile({ children, backgroundChildren }) {
  return (
    <>
      <div className={styles.content_container + " bg_star"}>
        <div className={`${styles.custom_container} custom_container`}>
          <SidebarProfile />
          <div
            className={styles.children_container}
            style={{ background: backgroundChildren }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
