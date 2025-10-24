import classes from "./checkout.module.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  BagCheck,
  Cart3,
  CreditCard,
  InfoCircle,
} from "@styled-icons/bootstrap";

const CheckoutNav = ({ tab, setTab, changeTab }) => {
  const { t } = useTranslation();

  function select(id) {
    if (changeTab) {
      setTab(id);
    }
  }

  return (
    <div className={classes.nav}>
      <div className={classes.active}>
        <Link href="/cart">
          <div className={classes.nav_svg}>
            <Cart3 width={20} height={20} />
          </div>
          <span>{t("장바구니")}</span>
        </Link>
      </div>
      {/* <div className={classes.active} onClick={() => select(1)}>
        <div className={classes.nav_svg}>
          <InfoCircle width={20} height={20} />
        </div>
        <span>{t("배송 및 결제 정보")}</span>
      </div>
      <div
        className={tab >= 2 ? classes.active : null}
        onClick={() => select(2)}
      >
        <div className={classes.nav_svg}>
          <CreditCard width={20} height={20} />
        </div>
        <span>{t("결제")}</span>
      </div> */}
      <div className={tab === 3 ? classes.active : null} aria-disabled={true}>
        <div className={classes.nav_svg}>
          <BagCheck width={20} height={20} />
        </div>
        <span>{t("확인")}</span>
      </div>
    </div>
  );
};

export default CheckoutNav;
