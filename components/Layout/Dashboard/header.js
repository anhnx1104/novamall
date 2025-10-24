import { List, Person } from "@styled-icons/bootstrap";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import classes from "./header.module.css";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { HeaderLogoLight } from "~/components/Ui/Icons/icons";
import { AccountPopover } from "./_components/accountPopover";
import { Iconify } from "~/components/iconify";
import { NotificationsPopover } from "./_components/notificationPopover";

const ImageLoader = dynamic(() => import("~/components/Image"));
const LanguageSwitcher = dynamic(() => import("~/components/LanguageSwitcher"));
const Notification = dynamic(() => import("~/components/Notification"));

const DashboardHeader = (props) => {
  const { session } = useSelector((state) => state.localSession);
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  return (
    <div className={classes.header}>
      <nav className={classes.header_content}>
        <button
          className={classes.sidebar_button}
          onClick={() => props.toggleMenu()}
        >
          <Iconify icon="custom:menu-duotone" width={28} />
        </button>
        <div className={classes.logo}>
          <Link href="/dashboard">
            <HeaderLogoLight />
          </Link>
        </div>
        {/* <Notification /> */}
        <NotificationsPopover />
        {/* <div className={classes.LanguageSwitcher}>
          <LanguageSwitcher />
        </div> */}
        {session && <AccountPopover />}
      </nav>
    </div>
  );
};

export default DashboardHeader;
