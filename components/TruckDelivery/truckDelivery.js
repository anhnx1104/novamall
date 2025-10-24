import styles from "./truckDelivery.module.css";
import { TruckShippingIcon } from "~/components/Ui/Icons/icons";

export default function TruckDelivery({ label }) {
  return (
    <p className={styles.truck}>
      <TruckShippingIcon />
      <span>{label}</span>
    </p>
  );
}
