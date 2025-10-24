import styles from "./homeContact.module.css";
import { useTranslation } from "react-i18next";
import {
  PaymentVisaIcon,
  PaymentMastercardIcon,
  PaymentPaypalIcon,
  PaymentGpayIcon,
  PaymentApplepayIcon,
} from "~/components/Ui/Icons/icons";
function HomeContact(props) {
  const { t } = useTranslation();

  return (
    <section className={styles.content}>
      <div className={styles.container}>
        {/* Left Side */}
        <div className={styles.left}>
          <div className={styles.block}>
            <h4>다양한 지불 방법</h4>
            <div className={styles.icons}>
              <PaymentVisaIcon />
              <PaymentMastercardIcon />
              <PaymentPaypalIcon />
              <PaymentGpayIcon />
              <PaymentApplepayIcon />
            </div>
          </div>

          <div className={styles.block}>
            <h4>신속한 주문 처리</h4>
            <div className={styles.icons}>
              <PaymentMastercardIcon />
            </div>
          </div>

          <div className={styles.block}>
            <h4>24시간 고객 지원</h4>
            <div className={styles.icons}>
              <PaymentVisaIcon />
              <PaymentGpayIcon />
              <PaymentApplepayIcon />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.right}>
          <h3>문의하기</h3>
          <p>문의하기문의하기문의하기문의하기문의하기문의하기</p>

          <form className={styles.form}>
            <input type="text" placeholder="이름을 작성해주세요." />
            <input type="email" placeholder="이메일을 작성해주세요." />
            <input type="tel" placeholder="전화번호를 작성해주세요." />
            <textarea rows="5" placeholder="문의를 작성해주세요." />
            <button type="submit">문의하기</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default HomeContact;
