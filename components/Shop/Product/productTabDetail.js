"use client";

import { useState } from "react";
import classes from "./productTabDetail.module.css";
import { ArrowMoreIcon } from "~/components/Ui/Icons/icons";

export default function ProductTabDetail() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>삼성전자 온라인 파트너</h2>
      <p className={classes.subtitle}>
        본 제품은 삼성전자가 공식 파트너사에 직접 공급하는 정품입니다.{" "}
      </p>

      <div className={classes.imageBox}>
        <img
          src="/images/review_img_detail.png"
          alt="LG OLED"
          className={classes.image}
        />
      </div>

      <p className={classes.desc}>
        Odio ultrices sed neque fermentum magna nibh. Ut mattis vel sed
        convallis libero. Purus congue cum tempor vitae.
      </p>

      <div className={`${classes.moreWrapper} ${showMore ? classes.open : ""}`}>
        <div className={classes.moreContent}>
          <div
            className={classes.productDetail + " " + classes.productDetailTag}
          >
            <p className={classes.productDetail_title}>관련 태그</p>
            <div className={classes.productDetail_content}>
              <div className={classes.tags}>
                {[
                  "운동보조제",
                  "비타민제",
                  "단백질쉐이크",
                  "트레이닝장비",
                  "영양간식",
                  "다이어트보조제",
                  "단백질",
                  "미용",
                  "식이섬유",
                  "건강",
                  "콜라겐",
                  "오메가3",
                ].map((tag, i) => (
                  <span key={i} className={classes.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className={classes.productDetail + " " + classes.productDetailTable}
          >
            <p className={classes.productDetail_title}>상품정보 제공고시</p>
            <div className={classes.productDetail_content}>
              <table className={classes.productDetail_table}>
                {[
                  { label: "상품정보 제공고시 제품소재", value: "CJ대한통운" },
                  { label: "색상", value: "편도 3,000원" },
                  { label: "치수", value: "편도 3,000원" },
                  { label: "제조자(사)", value: "서울특별시 돌곶이로 12234" },
                  { label: "제조자(국)", value: "서울특별시 돌곶이로 12234" },
                  {
                    label: "세탁방법 및 취급시 주의사항",
                    value: "서울특별시 돌곶이로 12234",
                  },
                  { label: "품질보증기준", value: "서울특별시 돌곶이로 12234" },
                  {
                    label: "A/S 책임자와 전화번호",
                    value: "상품 상세페이지 참조",
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className={classes.tableLabel}>{item.label}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
          <div
            className={classes.productDetail + " " + classes.productDetailTable}
          >
            <p className={classes.productDetail_title}>거래조건에 관한 정보</p>
            <div className={classes.productDetail_content}>
              <table className={classes.productDetail_table}>
                {[
                  {
                    label: "재화등의 배송방법에 관한 정보",
                    value: "CJ대한통운",
                  },
                  {
                    label: "주문 이후 예상되는 배송기간",
                    value: "편도 3,000원",
                  },
                  {
                    label:
                      "제품하자가 아닌 소비자의 단순변심에 따른 청약철회 시 소비자가 부담하는 반품비용 등에 관한 정보",
                    value: "편도 3,000원",
                  },
                  {
                    label:
                      "제품하자가 아닌 소비자의 단순변심에 따른 청약철회가 불가능한 경우 그 구체적 사유와 근거",
                    value: "서울특별시 돌곶이로 12234",
                  },
                  {
                    label: "재화등의 A/S 관련 전화번호",
                    value: "서울특별시 돌곶이로 12234",
                  },
                  {
                    label: "재화등의 교환·반품·보증 조건 및 품질보증기준",
                    value: "서울특별시 돌곶이로 12234",
                  },
                  {
                    label: "거래에 관한 약관의 내용 또는 확인할 수 있는 방법",
                    value: "서울특별시 돌곶이로 12234",
                  },
                  {
                    label:
                      "소비자피해보상의 처리, 재화등에 대한 불만 처리 및 소비자와 사업자 사이의 분쟁처리에 관한 사항",
                    value: "상품 상세페이지 참조",
                  },
                ].map((item, index) => (
                  <tr key={index}>
                    <td className={classes.tableLabel}>{item.label}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>

      <button
        className={classes.toggleBtn}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? (
          <p>
            상세정보 접기{" "}
            <span className={classes.arrowDown}>
              <ArrowMoreIcon />
            </span>
          </p>
        ) : (
          <p>
            상세정보 펼쳐보기{" "}
            <span className={classes.arrowUp}>
              <ArrowMoreIcon />
            </span>
          </p>
        )}
      </button>
    </div>
  );
}
