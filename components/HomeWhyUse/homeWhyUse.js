import styles from "./homeWhyUse.module.css";
import { useTranslation } from "react-i18next";
import {
  PaymentVisaIcon,
  PaymentMastercardIcon,
  PaymentPaypalIcon,
  PaymentGpayIcon,
  PaymentApplepayIcon,
} from "~/components/Ui/Icons/icons";
function HomeWhyUse(props) {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.h2}>
            노바샵을
            <br />
            이용해야하는
            <br />
            이유
          </h2>
          <h2 className={styles.h2Mobile}>노바샵을 이용해야하는 이유</h2>
        </div>

        <div className={styles.right}>
          <div className={styles.box}>
            <div className={styles.card}>
              <h3>
                <span className={`${styles.line} ${styles.blue}`}></span>
                Fast
              </h3>
              <p>
                Don’t keep your users waiting. Solana has block times of 400
                milliseconds — and as hardware gets faster, so will the network.
              </p>
            </div>

            <div className={styles.card}>
              <h3>
                <span className={`${styles.line} ${styles.purple}`}></span>
                Scalable
              </h3>
              <p>
                Get big, quick. Solana is made to handle thousands of
                transactions per second, and fees for both developers and users
                remain less than $0.0025.
              </p>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.card}>
              <h3>
                <span className={`${styles.line} ${styles.red}`}></span>
                Decentralized
              </h3>
              <p>
                The Solana network is validated by thousands of nodes that
                operate independently of each other, ensuring your data remains
                secure and censorship resistant.
              </p>
            </div>

            <div className={styles.card}>
              <h3>
                <span className={`${styles.line} ${styles.green}`}></span>
                Energy Efficient
              </h3>
              <p>
                Solana’s proof of stake network and other innovations minimize
                its impact on the environment. Each Solana transaction uses
                about the same energy as a few Google searches.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.gradient}></div>
      <div className={styles.overlayBottom}></div>
    </section>
  );
}

export default HomeWhyUse;
