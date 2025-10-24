import styles from "./productTabReturn.module.css";
import { useTranslation } from "react-i18next";
export default function ProductTabReturn() {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>{t("반품 교환 정보")}</h2>
      </div>
      <div className={styles.productDetail_content}>
        <table className={styles.productDetail_table}>
          <tr>
            <td
              className={styles.tableLabel}
              colSpan={4}
              style={{ textAlign: "center" }}
            >
              [해당 상품] 반품/교환 안내
            </td>
          </tr>
          <tr>
            <td className={styles.tableLabel}>택배사</td>
            <td colSpan={3}>CJ대한통운</td>
          </tr>
          <tr>
            <td className={styles.tableLabel}>반품배송비</td>
            <td>편도 3,000원</td>
            <td className={styles.tableLabel}>교환 배송비</td>
            <td>3,000원</td>
          </tr>
          <tr>
            <td className={styles.tableLabel}>
              반품/교환 사유에
              <br />
              따른 요청 가능 기간
            </td>
            <td colSpan={3}>
              표시/광고와 상이, 계약 내용과 다를 경우 상품 수령후 1주일 이내
            </td>
          </tr>
          <tr>
            <td className={styles.tableLabel}>
              반품/교환 불가능
              <br />
              사유
            </td>
            <td colSpan={3}>
              <ul>
                <li>반품요청기간이 지난 경우</li>
                <li>
                  구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우{" "}
                  <span>
                    (단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는
                    제외)
                  </span>
                </li>
                <li>
                  구매자의 책임있는 사유로 포장이 훼손되어 상품 가치가 현저히
                  상실된 경우 <span>(예: 식품, 화장품, 향수류, 음반 등)</span>
                </li>
                <li>
                  구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히
                  감소한 경우{" "}
                  <span>
                    (라벨이 떨어진 의류 또는 태그가 떨어진 명품관 상품인 경우)
                  </span>
                </li>
                <li>
                  시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가
                  현저히 감소한 경우
                </li>
                <li>
                  고객의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우{" "}
                  <span>
                    (판매자에게 회복불가능한 손해가 예상되고, 그러한 예정으로
                    청약철회권 행사가 불가하다는 사실을 서면 동의 받은 경우)
                  </span>
                </li>
                <li>
                  복제가 가능한 상품 등의 포장을 훼손한 경우{" "}
                  <span>(CD/DVD/GAME/도서의 경우 포장 개봉 시)</span>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
      <div className={styles.notes}>
        <p className={styles.notesTitle}>주의사항</p>
        <div className={styles.notesContent}>
          <p>
            전자상거래 등에서의 소비자보호에 관한 법률에 의한 반품 규정이
            판매자가 지정한 반품 조건보다 우선합니다.
          </p>
          <p>
            전자상거래 등에서의 소비자보호에 관한 법률에 의거하여 미성년자가
            물품을 구매하는 경우, 법정대리인과 동일하지 않으면 미성년자 본인
            또는 법정대리인이 구매를 취소할 수 있습니다.
          </p>
          <p>
            전기용품 및 생활용품 안전관리법 및 어린이제품 안전 특별법 규정에
            의한 안전관리대상 품목인 전기용품, 생활용품, 어린이제품을 판매 또는
            구매하실 경우에는 해당 제품의 안전인증, 안전확인, 공급자적합성확인,
            안전기준 준수 여부를 꼭 확인하시기 바랍니다.
          </p>
          <p>
            노바몰에 등록된 판매상품과 상품의 내용은 판매자가 등록한 것으로
            네이버는 등록된 내용에 대하여 일체의 책임을 지지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
